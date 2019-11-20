import lang from '../languages';
import { AccountTypes } from './constants';

export const wallets = {
  IMTOKEN: 'imtoken',
  ALPHA: 'alphawallet',
  METAMASK: 'metamask',
  TRUST: 'trust',
  COINBASE: 'coinbase',
  CIPHER: 'cipher',
  MIST: 'mist',
  PARITY: 'parity',
  INFURA: 'infura',
  LOCALHOST: 'localhost',
  OTHER: 'other'
};

export function getWebClientProviderName() {
  if (process.browser) {
    if (window.imToken) return wallets.IMTOKEN;

    if (!window.web3 || typeof window.web3.currentProvider === 'undefined')
      return '';

    if (window.web3.currentProvider.isAlphaWallet) return wallets.ALPHA;

    if (window.web3.currentProvider.isMetaMask) return wallets.METAMASK;

    if (window.web3.currentProvider.isTrust) return wallets.TRUST;

    if (typeof window.SOFA !== 'undefined') return wallets.COINBASE;

    if (typeof window.__CIPHER__ !== 'undefined') return wallets.CIPHER;

    if (window.web3.currentProvider.constructor.name === 'EthereumProvider')
      return wallets.MIST;

    if (window.web3.currentProvider.constructor.name === 'Web3FrameProvider')
      return wallets.PARITY;

    if (
      window.web3.currentProvider.host &&
      window.web3.currentProvider.host.indexOf('infura') !== -1
    )
      return wallets.INFURA;

    if (
      window.web3.currentProvider.host &&
      window.web3.currentProvider.host.indexOf('localhost') !== -1
    )
      return wallets.LOCALHOST;
  }
  return wallets.OTHER;
}

export function walletName(providerName) {
  switch (providerName) {
    case wallets.METAMASK:
      return lang.providers.metamask;
    case wallets.TRUST:
      return lang.providers.trust;
    case wallets.IMTOKEN:
      return lang.providers.imtoken;
    case wallets.COINBASE:
      return lang.providers.coinbase;
    case wallets.ALPHA:
      return lang.providers.alphawallet;
    default:
      return lang.providers.other;
  }
}

export function shortWalletName(providerName, type) {
  if (type === AccountTypes.LEDGER) return 'Ledger';
  if (type === AccountTypes.TREZOR) return 'Trezor';
  const name = walletName(providerName);
  if (name === lang.providers.other) return 'Wallet';
  return name.split(' ')[0];
}
