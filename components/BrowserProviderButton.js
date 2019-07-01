import React, { useMemo } from 'react';

import styled from 'styled-components';

// import MetaMaskLogo from '../assets/icons/metamask.svg';
// import TrustLogo from '../assets/icons/trust-logo.svg';
// import ImTokenLogo from '../assets/icons/imtoken-logo.svg';
// import coinbaseWalletLogo from '../assets/icons/coinbase-wallet.png';
// import alphaWalletLogo from '../assets/icons/alpha-wallet-logo.png';
import { wallets } from '../utils/web3';
import IconButton from '../components/IconButton';

// hack to get around button padding for now
// const MMLogo = styled(MetaMaskLogo)`
//   margin-top: -5px;
//   margin-bottom: -5px;
// `;

const providers = {
  metamask: "MetaMask",
  trust: "Trust",
  coinbase: "Coinbase Wallet",
  imtoken: "ImToken",
  alphawallet: "Alpha Wallet"
}

export default function BrowserProviderButton({ provider, ...props }) {
  // const icon = useMemo(() => {
  //   if (provider === wallets.METAMASK) {
  //     return <MMLogo />;
  //   } else if (provider === wallets.TRUST) {
  //     return <TrustLogo width="20px" height="20px" />;
  //   } else if (provider === wallets.IMTOKEN) {
  //     return (
  //       <ImTokenLogo
  //         css={`
  //           pointer-events: none;
  //         `}
  //         width="20px"
  //         height="20px"
  //       />
  //     );
  //   } else if (provider === wallets.COINBASE) {
  //     return <img src={coinbaseWalletLogo} width="20px" height="20px" alt="" />;
  //   } else if (provider === wallets.ALPHA) {
  //     return <img src={alphaWalletLogo} width="20px" height="20px" alt="" />;
  //   } else {
  //     return <div />;
  //   }
  // }, [provider]);

  return (
    <IconButton icon={null} {...props}>
      {providers[provider] || 'Active Wallet'}
    </IconButton>
  );
}
