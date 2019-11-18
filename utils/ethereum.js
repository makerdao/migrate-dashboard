import Web3 from 'web3';

export async function checkEthereumProvider() {
  if (typeof window.ethereum === 'undefined')
    throw new Error('No web3 provider detected');

  await window.ethereum.enable();

  const web3 = new Web3(window.ethereum);
  const networkId = await web3.eth.net.getId();
  const address = (await web3.eth.getAccounts())[0];

  return { networkId, address };
}

export const isValidAddressString = addressString =>
  /^0x([A-Fa-f0-9]{40})$/.test(addressString);

export const isValidTxString = txString =>
  /^0x([A-Fa-f0-9]{64})$/.test(txString);
