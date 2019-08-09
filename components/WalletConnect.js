import React, { useEffect } from 'react';
import styled from 'styled-components';
import lang from '../languages'
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

function WalletConnect (props) {
  useEffect(() => {
    walletConnector = new WalletConnector({
      bridge: 'https://bridge.walletconnect.org'
    });
  });
  return (
    <IconButton
      onClick={async () => {
        let response = await getWalletConnectAccounts()
        props.onAccountChosen({ address: response.address }, props.providerName);
      }}
      icon={<img src={walletConnect} />}
    >
      {lang.providers.wallet_connect}
    </IconButton>
  );
}

export default WalletConnect;
