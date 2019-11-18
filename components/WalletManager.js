import React, { useCallback } from 'react';
import useMaker from '../hooks/useMaker';
import IconButton from '../components/IconButton';
import { Grid } from '@makerdao/ui-components-core';
import BrowserProviderButton from '../components/BrowserProviderButton';
import walletConnect from '../assets/icons/walletConnect.svg';
import walletLink from '../assets/icons/wallet-link.svg';
import { BrowserView } from 'react-device-detect';

import Router from 'next/router';
import lang from '../languages';
import { connectBrowserProvider } from '../maker';

function WalletManager({ providerName }) {
  const { maker } = useMaker();

  const onAccountChosen = useCallback(
    async ({ address }) => {
      maker.useAccountWithAddress(address);
      Router.push('/overview');
    },
    [maker]
  );

  const connectToProviderOfType = async type => {
    const account = await maker.addAccount({
      type
    });
    maker.useAccountWithAddress(account.address);
    Router.push('/overview');
  };


  async function connectBrowserWallet() {
    try {
      const connectedAddress = await connectBrowserProvider(maker);
      onAccountChosen({ address: connectedAddress }, providerName);
    } catch (err) {
      window.alert(err);
    }
  }

  return (
    <Grid px="m" py="xs" gridRowGap="s" justifyContent={['center', 'center']}>
      <BrowserProviderButton
        onClick={connectBrowserWallet}
        disabled={!maker}
        provider={providerName}
      />
      <BrowserView>
        <IconButton
          onClick={() => {
            connectToProviderOfType('walletconnect');
          }}
          disabled={!maker}
          icon={
            <img
              src={walletConnect}
              css={{ marginTop: -5, marginBottom: -5 }}
            />
          }
        >
          {lang.providers.wallet_connect}
        </IconButton>
      </BrowserView>
      <BrowserView>
        <IconButton
          onClick={() => {
            connectToProviderOfType('walletlink');
          }}
          disabled={!maker}
          icon={
            <img
              src={walletLink}
              css={{
                marginTop: -5,
                marginBottom: -5,
                paddingLeft: 2,
                width: 26
              }}
            />
          }
        >
          {lang.providers.wallet_link}
        </IconButton>
      </BrowserView>
    </Grid>
  );
}

export default WalletManager;
