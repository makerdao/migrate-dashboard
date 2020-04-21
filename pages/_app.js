import React, { Fragment } from 'react';
import App from 'next/app';
import Head from 'next/head';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import '@makerdao/ui-components-core/dist/styles/global.css';
import MakerProvider from '../providers/MakerProvider';
import StoreProvider from '../providers/StoreProvider';
import theme, { getColor } from '../utils/theme';
import DevFooter from '../components/DevFooter';
import Toast from '../components/Toast';

const GlobalStyle = createGlobalStyle`
  html {
    min-height: 100%;
  }
  body {
    background-color: ${getColor('lightGrey')};
  }
`;

export default class MyApp extends App {
  state = {};

  UNSAFE_componentWillMount() {
    if (typeof window !== 'undefined') {
      global.scdESTest = !!window.location.search.includes('scdes');
      global.mcdESTest = !!window.location.search.includes('mcdes');
      global.testnet = !!window.location.search.includes('testnet');
    }
  }

  componentDidMount() {
    let network;
    if (window.location.search.includes('kovan')) {
      network = 'kovan';
    } else if (window.location.search.includes('testnet')) {
      network = 'testnet';
    } else {
      network = 'mainnet';
    }

    this.setState({
      network: network
    });
  }

  render() {
    const { Component, pageProps } = this.props;
    const { network } = this.state;
    return (
      <Fragment>
        <Head>
          <title>Migrate and Upgrade | Maker</title>
        </Head>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <MakerProvider network={network}>
            <StoreProvider>
              <Component {...pageProps} />
              <Toast />
              <DevFooter />
            </StoreProvider>
          </MakerProvider>
        </ThemeProvider>
      </Fragment>
    );
  }
}
