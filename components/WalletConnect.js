import React, { useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import IconButton from '../components/IconButton';
import walletConnect from '../assets/icons/walletConnect.svg'
import WalletConnector from '@walletconnect/browser';
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal';

let walletConnector

function getWalletConnectAccounts() {
  return new Promise((res, rej) => {
    if (!walletConnector.connected) {
      walletConnector.createSession().then(() => {
        const uri = walletConnector.uri;
        WalletConnectQRCodeModal.open(uri);
      });
    } else {
      const uri = walletConnector.uri;
      WalletConnectQRCodeModal.open(uri);
    }
    walletConnector.on('connect', (error, payload) => {
      rej(error);
      WalletConnectQRCodeModal.close();
      const { accounts, chainId } = payload.params[0];
      return res({ accounts, chainId });
    });
  });
}

function WalletConnect() {
  useEffect(() => {
    walletConnector = new WalletConnector({
      bridge: 'https://bridge.walletconnect.org'
    });
  });
  return (
    <Link>
      <IconButton
        onClick={async () => {
          await getWalletConnectAccounts()
        }}
        icon={<img src={walletConnect}/>}
      >
        Wallet Connect
      </IconButton>
    </Link>
  );
}

export default WalletConnect;
