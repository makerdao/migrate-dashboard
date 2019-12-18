import UpgradeSai from '../../../pages/migration/dai';
import render from '../../helpers/render';
import { SAI, DAI } from '../../../maker';
import { cleanup, fireEvent, wait } from '@testing-library/react';
import Maker from '@makerdao/dai';
import McdPlugin from '@makerdao/dai-plugin-mcd';
import BigNumber from 'bignumber.js';
import round from 'lodash/round';
const { change, click } = fireEvent;

afterEach(cleanup);

test('basic rendering', async () => {
  const { getByText } = await render(<UpgradeSai />, {
    initialState: {
      saiBalance: SAI(100.789),
      daiAvailable: DAI(1000)
    }
  });
  getByText(/Upgrade Single-Collateral Sai/);
});

test('not enough SAI', async () => {
  const { getByRole, getByText } = await render(<UpgradeSai />, {
    initialState: {
      saiBalance: SAI(10),
      daiAvailable: DAI(12)
    }
  });

  fireEvent.change(getByRole('textbox'), { target: { value: '11' } });
  getByText('Insufficient Sai balance');
});

test('not enough DAI headroom', async () => {
  const { getByRole, getByText } = await render(<UpgradeSai />, {
    initialState: {
      saiBalance: SAI(12),
      daiAvailable: DAI(10)
    }
  });

  fireEvent.change(getByRole('textbox'), { target: { value: '11' } });
  getByText('Amount exceeds Dai availability');
});

describe('with live testchain', () => {
  let maker, startingBalance;

  beforeEach(async () => {
    maker = await Maker.create('test', { plugins: [McdPlugin], log: false });
    const proxy = await maker.service('proxy').ensureProxy();
    await maker.service('cdp').openProxyCdpLockEthAndDrawDai(1, 50, proxy);
    startingBalance = await maker.getToken('MDAI').balance();
  });

  test('the whole flow', async () => {
    const { findByText, getByText, getByRole, getByTestId } = await render(
      <UpgradeSai />,
      {
        initialState: {
          // it doesn't get these values automatically because we're rendering the
          // upgrade flow in isolation
          saiBalance: SAI(50),
          daiAvailable: DAI(1000),
          dsrAnnual: BigNumber(1.05)
        }
      }
    );

    await wait(() => expect(window.maker).toBeTruthy());

    const address = window.maker.currentAddress();
    expect(address).toEqual(maker.currentAddress());

    // check that the address is showing in the account box
    await wait(() => getByText(new RegExp(address.substring(0, 6))));

    const amount = '47.3571102';
    change(getByRole('textbox'), { target: { value: amount } });
    click(getByText('Continue'));

    getByText('Confirm Transaction');
    getByText(`${round(amount, 2)} Single-Collateral Sai`);
    expect(getByText('Continue').disabled).toBeTruthy();

    click(getByTestId('allowance-toggle'));
    await findByText('SAI unlocked');

    click(getByRole('checkbox'));
    click(getByText('Continue'));

    await findByText('Your Sai is being upgraded');
    await findByText('Earn savings on your Dai');
    getByText('5%');

    expect(await maker.getToken('MDAI').balance()).toEqual(
      startingBalance.plus(amount)
    );
  }, 10000);
});
