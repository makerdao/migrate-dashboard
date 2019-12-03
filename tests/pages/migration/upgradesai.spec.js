import UpgradeSai from '../../../pages/migration/dai';
import render from '../../helpers/render';
import { SAI, DAI } from '../../../maker';
import { fireEvent, waitForElement } from '@testing-library/react';
import waitForExpect from 'wait-for-expect';
// import Maker from '@makerdao/dai';

// beforeAll(async () => {
//   maker = await Maker.create('test', { log: false });
//   const proxy = await maker.service('proxy').ensureProxy();
//   await maker.service('cdp').openProxyCdpLockEthAndDrawDai(10, 100, proxy);
// });

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

let maker;

xtest('the whole flow', async () => {
  // assume test environment is set up
  // generate some sai for test user

  const { getByText, getByRole, debug } = await render(<UpgradeSai />, {
    initialState: {
      // it doesn't get this value automatically because we're rendering the
      // upgrade flow in isolation
      saiBalance: SAI(100),
      daiAvailable: DAI(1000)
    }
  });

  // wait for maker instance to finish setting up
  await waitForExpect(() => expect(window.maker).toBeTruthy());

  // check that the address is showing in the account box
  const address = window.maker.currentAddress();
  expect(address).toEqual(maker.currentAddress());
  waitForElement(() => getByText(new RegExp(address.substring(0, 6))));

  fireEvent.change(getByRole('textbox'), { target: { value: '99' } });
  fireEvent.click(getByText('Continue'));
  debug();

  // enter amount
  // click continue
  //
});
