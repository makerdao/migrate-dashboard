import { useContext, useEffect, useState } from 'react';
import { checkEthereumProvider } from '../utils/ethereum';
import { MakerObjectContext } from '../providers/MakerProvider';

function useMaker() {
  const { maker, account, network } = useContext(MakerObjectContext) || {};

  const _getMatchedAccount = address =>
    maker
      .listAccounts()
      .find(acc => acc.address.toUpperCase() === address.toUpperCase());

  const connectBrowserProvider = async () => {
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

    let account;
    if (maker.service('accounts').hasAccount()) {
      const matchedAccount = _getMatchedAccount(browserProvider.address);
      if (!matchedAccount) {
        account = await maker.addAccount({
          type: 'browser',
          autoSwitch: true
        });
      } else {
        account = matchedAccount;
      }
    } else {
      account = await maker.addAccount({
        type: 'browser',
        autoSwitch: true
      });
    }

    maker.useAccountWithAddress(account.address);
    const connectedAddress = maker.currentAddress();
    return connectedAddress;
  };

  return {
    maker,
    connectBrowserProvider,
    account,
    network
  };
}

export default useMaker;
