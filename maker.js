import Maker from '@makerdao/dai';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
import { checkEthereumProvider } from './utils/ethereum';

let _maker;

export function getMaker() {
  if (_maker === undefined) throw new Error('Maker has not been instatiated');
  return _maker;
}

export async function instantiateMaker({ rpcUrl }) {
  const trezorPlugin = require('@makerdao/dai-plugin-trezor-web').default;

  const config = {
    log: false,
    plugins: [trezorPlugin, ledgerPlugin],
    smartContract: {
      addContracts: {}
    },
    provider: {
      url: rpcUrl,
      type: 'HTTP'
    }
  };

  const maker = await Maker.create('http', config);

  // for debugging
  window.maker = maker;

  return maker;
}

export async function connectBrowserProvider(maker) {
  const networkId = maker.service('web3').networkId();
  const browserProvider = await checkEthereumProvider();

  if (browserProvider.networkId !== networkId)
    throw new Error(
      'browser ethereum provider and URL network param do not match.'
    );

  if (!browserProvider.address.match(/^0x[a-fA-F0-9]{40}$/))
    throw new Error(
      'browser ethereum provider providing incorrect or non-existent address'
    );

  const getMatchedAccount = address =>
    maker
      .listAccounts()
      .find(acc => acc.address.toUpperCase() === address.toUpperCase());

  let account;
  if (maker.service('accounts').hasAccount()) {
    const matchedAccount = getMatchedAccount(browserProvider.address);
    if (!matchedAccount) {
      account = await maker.addAccount({ type: 'browser', autoSwitch: true });
    } else {
      account = matchedAccount;
    }
  } else {
    account = await maker.addAccount({ type: 'browser', autoSwitch: true });
  }

  maker.useAccountWithAddress(account.address);
  return maker.currentAddress();
}
