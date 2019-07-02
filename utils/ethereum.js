
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
