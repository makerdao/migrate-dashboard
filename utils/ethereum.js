import Web3 from 'web3';
import round from 'lodash/round';
import { ETH } from '../maker';

export async function checkEthereumProvider() {
  let provider;
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.autoRefreshOnNetworkChange = false;
    await window.ethereum.enable();
    provider = window.ethereum;
  } else if (window.web3) {
    provider = window.web3.currentProvider;
  } else {
    throw new Error('No web3 provider detected');
  }

  const web3 = new Web3(provider);
  const networkId = await web3.eth.net.getId();
  const address = (await web3.eth.getAccounts())[0];

  return { networkId, address };
}

export const isValidAddressString = addressString =>
  /^0x([A-Fa-f0-9]{40})$/.test(addressString);

export const isValidTxString = txString =>
  /^0x([A-Fa-f0-9]{64})$/.test(txString);

export const toNum = async promise => {
  const val = await promise;
  return val.toBigNumber().toFixed();
};

export const addEthBalance = async account => {
  return {
    ...account,
    ethBalance: round(
      await toNum(window.maker.getToken(ETH).balanceOf(account.address)),
      3
    )
  };
};
