
import styled from 'styled-components'
import useMaker from '../hooks/useMaker';
import IconButton from '../components/IconButton'
import { Grid } from '@makerdao/ui-components-core'
import BrowserProviderButton from '../components/BrowserProviderButton'
// import Metamask from '../assets/icons/metamask.svg'
// import Trezor from '../assets/icons/trezor.svg'
// import Ledger from '../assets/icons/ledger.svg'
// import WalletConnect from '../assets/icons/walletConnect.svg'
import { getWebClientProviderName } from '../utils/web3';

// const StyledLedgerLogo = styled(Ledger)`
//   margin-top: -5px;
//   margin-bottom: -5px;
// `;

// const StyledTrezorLogo = styled(Trezor)`
//   margin-top: -5px;
//   margin-bottom: -5px;
// `;

// const StyledWalletConnectLogo = styled(WalletConnect)`
//   margin-top: -5px;
//   margin-bottom: -5px;
// `;

function WalletManager() {
  const { authenticated: makerAuthenticated } = useMaker();
  const providerName = getWebClientProviderName();

  return (
    <Grid px="m" py="xs" gridRowGap="s">
      <BrowserProviderButton
        onClick={() => null}
        disabled={!makerAuthenticated}
        provider={providerName}
      />
      <IconButton
        onClick={() => null}
        disabled={!makerAuthenticated}
        icon={null}
      >
        Trezor
      </IconButton>
      <IconButton
        onClick={() => null}
        disabled={!makerAuthenticated}
        icon={null}
      >
        Ledger
      </IconButton>
      <IconButton
        onClick={() => null}
        icon={null}
      >
        Wallet Connect
      </IconButton>
    </Grid>
  )
}

export default WalletManager
