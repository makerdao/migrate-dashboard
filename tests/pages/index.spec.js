import Index from '../../pages';
import render from '../helpers/render';
import {
  fireEvent,
  wait,
} from '@testing-library/react';
const { click } = fireEvent;
import assert from 'assert';

const mockAddresses = ['0xb8925CA53B2F48743E927dC4101953159c4809c1', '0x52D62C6F521e8534D646394864f43085c4180D2b', '0x5Ee6e60F8f818909621adF6bc5DE29e470620990', '0xe5FDA1099deBC1E56bc1fac835826cc1ACd81758', '0xe05FEf9Ed154f326dDF59ac2916349B94304D90a', '0x95f509E1dAf971603eb9f442e786Bd6CD272C6Fa', '0x6abE49a3Ee7d8c4bbC06cF6fCb0e6504d3a71c66', '0xE892E4D78BB68A5118d8F984633a2a62cE919E2B', '0x7Fc5CD873ecAB1cef7C4694D7d6db645DCCa7Bf9', '0x4D83190b34982236b52a04c478a604a0Ff9d820A'];

const mockHardwareFactory = jest.fn(async settings => {
  const subprovider = {};

  let address;

  if (settings.accountsLength && settings.accountsLength > 1) {
    if (!settings.choose) {
      throw new Error(
        'If accountsLength > 1, "choose" must be defined in account options.'
      );
    }

    const addresses = await new Promise(resolve =>{
      setTimeout(()=>{
        resolve(mockAddresses);
      }, 100);
    });
    address = await new Promise((resolve, reject) => {
      const callback = (err, address) =>
        err ? reject(err) : resolve(address);

      // this chooser function allows the app using the plugin to display the
      // list of addresses to a human user and let them make a choice.
      settings.choose(
        Object.keys(addresses).map(k => addresses[k]),
        callback
      );
    });
  } else {
    address = await new Promise((resolve, reject) =>
      subprovider.getAccounts((err, addresses) =>
        err ? reject(err) : resolve(addresses[0])
      )
    );
  }

  return { subprovider, address };
});

test('render and get starting data', async () => {
  let state;
  const { getByText } = await render(<Index />, {
    onStateChange: s => {
      state = s;
    }
  });
  getByText(/Migrate and Upgrade/);
  await wait(() => assert(state.saiAvailable));
  getByText(/Sai available for CDP migration/);
});

test('select trezor address', async () => {
  let maker;
  const { getByText } = await render(<Index />,{
    getMaker: m => {
      maker = m;
    }
  });
  const div = document.createElement('DIV');
  div.id = 'modal';
  document.body.appendChild(div);
  await wait(() => expect(maker).toBeTruthy());
  maker.service('accounts')._accountFactories['trezor'] = mockHardwareFactory;
  click(getByText(/Trezor/));
  getByText(/Connect your trezor wallet/);
  expect(mockHardwareFactory).toBeCalled();
  await wait(() => getByText(/Select address/));
});

test('select ledger address', async () => {
  let maker;
  const { getByText, getAllByText } = await render(<Index />,{
    getMaker: m => {
      maker = m;
    }
  });
  const div = document.createElement('DIV');
  div.id = 'modal';
  document.body.appendChild(div);
  await wait(() => expect(maker).toBeTruthy());
  maker.service('accounts')._accountFactories['ledger'] = mockHardwareFactory;
  click(getByText(/Ledger Nano/));
  getByText(/Connect Ledger Live or Legacy/);
  click(getAllByText('Connect')[0]); //click the 1st connect button (Ledger Live)
  getByText(/Connect your ledger wallet/);
  expect(mockHardwareFactory).toBeCalled();
  await wait(() => getByText(/Select address/));
});