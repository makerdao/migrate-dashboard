import Maker from '@makerdao/dai';
import daiPlugin from '@makerdao/dai-plugin-mcd';
import migrationPlugin from '@makerdao/dai-plugin-migrations';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
import walletLinkPlugin from '@makerdao/dai-plugin-walletlink';
import walletConnectPlugin from '@makerdao/dai-plugin-walletconnect';
import { checkEthereumProvider } from './utils/ethereum';
import { createCurrency } from '@makerdao/currency';

let maker;

export const SAI = createCurrency('SAI');
export const ETH = createCurrency('ETH');
export const USD = Maker.USD;

export function getMaker() {
  if (maker === undefined) throw new Error('Maker has not been instantiated');
  return maker;
}

export async function instantiateMaker({ rpcUrl }) {
  const trezorPlugin = require('@makerdao/dai-plugin-trezor-web').default;

  const config = {
    log: false,
    plugins: [
      trezorPlugin,
      ledgerPlugin,
      walletLinkPlugin,
      walletConnectPlugin,
      [daiPlugin, { cdpTypes: [{ currency: SAI, ilk: 'SAI' }, {currency: ETH, ilk: 'ETH-A'}] }],
      migrationPlugin
    ],
    smartContract: {
      addContracts: {}
    },
    provider: {
      url: rpcUrl,
      type: 'HTTP'
    },
    multicall: true
  };

  maker = await Maker.create('http', config);
  window.maker = maker; // for debugging
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
