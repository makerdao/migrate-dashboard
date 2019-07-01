import React, { useCallback } from 'react'
import styled from 'styled-components'
import useMaker from '../hooks/useMaker';
import IconButton from '../components/IconButton'
import { Grid } from '@makerdao/ui-components-core'
import BrowserProviderButton from '../components/BrowserProviderButton'
import Trezor from '../assets/icons/trezor.svg'
import Ledger from '../assets/icons/ledger.svg'
import WalletConnect from '../assets/icons/walletConnect.svg'
import { getWebClientProviderName } from '../utils/web3';
import Router from 'next/router'
import { useLedger, useTrezor } from '../hooks/useHardwareWallet';

const StyledLedgerLogo = styled(Ledger)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

const StyledTrezorLogo = styled(Trezor)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

const StyledWalletConnectLogo = styled(WalletConnect)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

function WalletManager() {
  const {
    maker,
   	authenticated: makerAuthenticated,
    connectBrowserProvider
  } = useMaker();
  const providerName = getWebClientProviderName();

  const onAccountChosen = useCallback(
    async ({ address }, type) => {
      maker.useAccountWithAddress(address);
      Router.push(`/overview?${address}`)
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
        disabled={!makerAuthenticated}
        provider={providerName}
      />
      <IconButton
        onClick={connectTrezorWallet}
        disabled={!makerAuthenticated}
        icon={<StyledTrezorLogo />}
      >
        Trezor
      </IconButton>
      <IconButton
        onClick={connectLedgerWallet}
        disabled={!makerAuthenticated}
        icon={<StyledLedgerLogo />}
      >
        Ledger
      </IconButton>
      <IconButton
        onClick={() => null}
        icon={<StyledWalletConnectLogo />}
      >
        Wallet Connect
      </IconButton>
    </Grid>
  )
}

export default WalletManager
