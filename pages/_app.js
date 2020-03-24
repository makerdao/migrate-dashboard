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

  componentDidMount() {
    this.setState({
      network: window.location.search.includes('kovan') ? 'kovan' : 'mainnet',
      scdESTest: !!window.location.search.includes('scdes')
    });
  }

  render() {
    const { Component, pageProps } = this.props;
    const { network, scdESTest } = this.state;
    return (
      <Fragment>
        <Head>
          <title>Migrate and Upgrade | Maker</title>
        </Head>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <MakerProvider network={network} options={{scdESTest}}>
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
