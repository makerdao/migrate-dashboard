import React, { useCallback } from 'react';
import useMaker from '../hooks/useMaker';
import IconButton from '../components/IconButton';
import { Grid } from '@makerdao/ui-components-core';
import BrowserProviderButton from '../components/BrowserProviderButton';
import WalletConnectButton from '../components/WalletConnect';
import Trezor from '../assets/icons/trezor.svg';
import Ledger from '../assets/icons/ledger.svg';
import { getWebClientProviderName } from '../utils/web3';
import Router from 'next/router';
import lang from '../languages';
import { useLedger, useTrezor } from '../hooks/useHardwareWallet';

function WalletManager() {
  const { maker, connectBrowserProvider } = useMaker();
  const providerName = getWebClientProviderName();

  const onAccountChosen = useCallback(
    async ({ address }, type) => {
      maker.useAccountWithAddress(address);
      Router.push(`/overview?${address}`);
    },
    [maker]
  );

  const { connectTrezorWallet } = useTrezor({ onAccountChosen });
  const { connectLedgerWallet } = useLedger({ onAccountChosen });

  async function connectBrowserWallet() {
    try {
      const connectedAddress = await connectBrowserProvider();
      onAccountChosen({ address: connectedAddress }, providerName);
    } catch (err) {
      window.alert(err);
    }
  }

  return (
    <Grid px="m" py="xs" gridRowGap="s">
      <BrowserProviderButton
        onClick={connectBrowserWallet}
        disabled={!maker}
        provider={providerName}
      />
      <IconButton
        onClick={connectTrezorWallet}
        disabled={!maker}
        icon={
          <img
            src={Trezor}
            css={{ marginTop: -5, marginBottom: -5, paddingLeft: 5 }}
          />
        }
      >
        {lang.providers.trezor}
      </IconButton>
      <IconButton
        onClick={connectLedgerWallet}
        disabled={!maker}
        icon={
          <img
            src={Ledger}
            css={{ marginTop: -5, marginBottom: -5, paddingLeft: 5 }}
          />
        }
      >
        {lang.providers.ledger_nano}
      </IconButton>
      <WalletConnectButton onClick={onAccountChosen} provider={providerName} />
    </Grid>
  );
}

export default WalletManager;
