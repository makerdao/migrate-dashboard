export async function checkEthereumProvider() {
  return new Promise(async (res, rej) => {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.enable();
      const { selectedAddress, networkVersion } = window.ethereum;
      res({
        networkId: parseInt(networkVersion, 10),
        address: selectedAddress
      });
    } else rej('No web3 provider detected');
  });
}

export const isValidAddressString = addressString =>
  /^0x([A-Fa-f0-9]{40})$/.test(addressString);

export const isValidTxString = txString =>
  /^0x([A-Fa-f0-9]{64})$/.test(txString);

export const etherscanLink = (string, network = 'mainnet') => {
  const pathPrefix = network === 'mainnet' ? '' : `${network}.`;
  if (isValidAddressString(string))
    return `https://${pathPrefix}etherscan.io/address/${string}`;
  else if (isValidTxString(string))
    return `https://${pathPrefix}etherscan.io/tx/${string}`;
  else throw new Error(`Can't create Etherscan link for "${string}"`);
};
