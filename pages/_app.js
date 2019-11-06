import React, { Fragment } from 'react';
import App from 'next/app';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import '@makerdao/ui-components-core/dist/styles/global.css';
import MakerProvider from '../providers/MakerProvider';
import StoreProvider from '../providers/StoreProvider';
import WalletProvider from '../providers/WalletProvider';
import theme, { getColor } from '../utils/theme';
import { wallets, templates } from '../components/wallets';
import Version from '../components/Version';

const GlobalStyle = createGlobalStyle`
  html {
    min-height: 100%;
  }
  body {
    background-color: ${getColor('lightGrey')};
  }
`;

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Fragment>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <MakerProvider
            rpcUrl="https://kovan.infura.io/v3/58073b4a32df4105906c702f167b91d2"
            network="kovan"
          >
            <StoreProvider>
              <WalletProvider modals={wallets} templates={templates}>
                <Component {...pageProps} />
              </WalletProvider>
            </StoreProvider>
          </MakerProvider>
        </ThemeProvider>
        <Version />
      </Fragment>
    );
  }
}
