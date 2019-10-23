import React, { useMemo } from 'react';
import Link from 'next/link';
import metamask from '../assets/icons/metamask.svg';
import trustLogo from '../assets/icons/trust-logo.svg';
import imTokenLogo from '../assets/icons/imtoken-logo.svg';
import coinbaseWalletLogo from '../assets/icons/coinbase-wallet.png';
import alphaWalletLogo from '../assets/icons/alpha-wallet-logo.png';
import { wallets } from '../utils/web3';
import IconButton from './IconButton';
import lang from '../languages';

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

  const name = useMemo(() => {
    if (provider === wallets.METAMASK) {
      return lang.providers.metamask;
    } else if (provider === wallets.TRUST) {
      return lang.providers.trust;
    } else if (provider === wallets.IMTOKEN) {
      return lang.providers.imtoken;
    } else if (provider === wallets.COINBASE) {
      return lang.providers.coinbase;
    } else if (provider === wallets.ALPHA) {
      return lang.providers.alphawallet;
    } else {
      return lang.providers.other;
    }
  }, [provider]);

  return (
    <Link href="/overview">
      <IconButton icon={icon} {...props}>
        {name}
      </IconButton>
    </Link>
  );
}
