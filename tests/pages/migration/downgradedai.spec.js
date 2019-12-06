import DowngradeDai from '../../../pages/migration/sai';
import render from '../../helpers/render';
import { SAI, DAI } from '../../../maker';
import {
  cleanup,
  fireEvent,
  wait,
  waitForElement
} from '@testing-library/react';
import Maker from '@makerdao/dai';
import McdPlugin, { ETH } from '@makerdao/dai-plugin-mcd';
import round from 'lodash/round';
const { change, click } = fireEvent;

afterEach(cleanup);

test('basic rendering', async () => {
  const { getByText } = await render(<DowngradeDai />, {
    initialState: {
      daiBalance: DAI(100.789),
      saiAvailable: SAI(1000)
    }
  });
  getByText(/Convert Dai to Sai/);
});

test('not enough DAI', async () => {
  const { getByRole, getByText } = await render(<DowngradeDai />, {
    initialState: {
      daiBalance: DAI(10),
      saiAvailable: SAI(12)
    }
  });

  fireEvent.change(getByRole('textbox'), { target: { value: '11' } });
  getByText('Insufficient Dai balance');
});

test('not enough SAI headroom', async () => {
  const { getByRole, getByText } = await render(<DowngradeDai />, {
    initialState: {
      daiBalance: DAI(12),
      saiAvailable: SAI(10)
    }
  });

  fireEvent.change(getByRole('textbox'), { target: { value: '11' } });
  getByText('Amount exceeds Sai availability');
});

describe('with live testchain', () => {
  let maker, startingBalance;

  beforeEach(async () => {
    maker = await Maker.create('test', { plugins: [McdPlugin], log: false });
    const proxy = await maker.service('proxy').ensureProxy();
     //generate 50 DAI
    await window.maker.service('mcd:cdpManager').openLockAndDraw('ETH-A', ETH(1), 50);
    //put 1000 SAI in the migration contract
    await window.maker.service('cdp').openProxyCdpLockEthAndDrawDai(10, 1000, proxy);
    const migrationContractAddress = window.maker
    .service('smartContract')
    .getContract('MIGRATION').address;
    await window.maker.getToken('SAI').approveUnlimited(migrationContractAddress);
    const mig = window.maker.service('migration').getMigration('sai-to-dai');
    await mig.execute(SAI(1000));

    startingBalance = await window.maker.getToken('DAI').balance();
  });

  test('the whole flow', async () => {
    const { getByText, getByRole, getByTestId } = await render(<DowngradeDai />, {
      initialState: {
        // it doesn't get these values automatically because we're rendering the
        // upgrade flow in isolation
        daiBalance: DAI(50),
        saiAvailable: SAI(1000),
      }
    });

    await wait(() => expect(window.maker).toBeTruthy());

    const address = window.maker.currentAddress();
    expect(address).toEqual(maker.currentAddress());

    // check that the address is showing in the account box
    await wait(() => getByText(new RegExp(address.substring(0, 6))));

    const amount = '47.3571102';
    change(getByRole('textbox'), { target: { value: amount } });
    click(getByText('Continue'));

    getByText('Confirm Transaction');
    getByText(`${round(amount, 2)} Multi-Collateral Dai`);
    expect(getByText('Continue').disabled).toBeTruthy();

    click(getByTestId('allowance-toggle'));
    await waitForElement(() => getByText('DAI unlocked'));

    click(getByRole('checkbox'));
    await waitForElement(() => !getByText('Continue').disabled);

    click(getByText('Continue'));

    await waitForElement(() => getByText('Your Dai is being converted'));
    await waitForElement(() => getByText('Exit'));
    getByText(`${round(amount, 2)} SAI`);

    expect(await maker.getToken('DAI').balance()).toEqual(
      startingBalance.plus(amount)
    );
  }, 10000);
});
