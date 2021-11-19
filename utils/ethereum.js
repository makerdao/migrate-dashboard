import Web3 from 'web3';
import round from 'lodash/round';
import { ETH } from '../maker';
import assert from 'assert';
import BigNumber from 'bignumber.js';
import { utils as ethersUtils } from 'ethers';

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

export function bytesToString(hex) {
  return Buffer.from(hex.replace(/^0x/, ''), 'hex')
    .toString()
    .replace(/\x00/g, ''); // eslint-disable-line no-control-regex
}

export function stringToBytes(str) {
  assert(!!str, 'argument is falsy');
  assert(typeof str === 'string', 'argument is not a string');
  return ethersUtils.formatBytes32String(str);
}

export function fromWei(value) {
  return BigNumber(value).shiftedBy(-18);
}

export function fromRay(value) {
  return BigNumber(value).shiftedBy(-27);
}

export function fromRad(value) {
  return BigNumber(value).shiftedBy(-45);
}
