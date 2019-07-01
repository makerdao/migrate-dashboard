import round from 'lodash/round'

export const addMkrAndEthBalance = async account => {
  return {
    ...account,
    ethBalance: round(
      await toNum(window.maker.getToken(ETH).balanceOf(account.address)),
      3
    ),
    mkrBalance: round(
      await toNum(window.maker.getToken(MKR).balanceOf(account.address)),
      3
    )
  };
};


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
