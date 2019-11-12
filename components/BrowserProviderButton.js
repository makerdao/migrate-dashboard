import React, { useMemo } from 'react';
import metamask from '../assets/icons/metamask.svg';
import trustLogo from '../assets/icons/trust-logo.svg';
import imTokenLogo from '../assets/icons/imtoken-logo.svg';
import coinbaseWalletLogo from '../assets/icons/coinbase-wallet.png';
import alphaWalletLogo from '../assets/icons/alpha-wallet-logo.png';
import { wallets, walletName } from '../utils/web3';
import IconButton from './IconButton';

export default function BrowserProviderButton({ provider, ...props }) {
  const icon = useMemo(() => {
    if (provider === wallets.METAMASK) {
      return (
        <img src={metamask} css={{ marginTop: '-5px', marginBottom: '-5px' }} />
      );
    } else if (provider === wallets.TRUST) {
      return <img src={trustLogo} css={{ width: '20px', height: '20px' }} />;
    } else if (provider === wallets.IMTOKEN) {
      return <img src={imTokenLogo} css={{ width: '20px', height: '20px' }} />;
    } else if (provider === wallets.COINBASE) {
      return (
        <img
          src={coinbaseWalletLogo}
          css={{ width: '20px', height: '20px' }}
          alt=""
        />
      );
    } else if (provider === wallets.ALPHA) {
      return (
        <img
          src={alphaWalletLogo}
          css={{ width: '20px', height: '20px' }}
          alt=""
        />
      );
    } else {
      return <div />;
    }
  }, [provider]);

  return (
    <IconButton icon={icon} {...props}>
      {walletName(provider)}
    </IconButton>
  );
}
