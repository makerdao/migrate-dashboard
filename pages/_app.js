import React from 'react'
import App, { Container } from 'next/app'
import { ModalProvider } from "react-modal-hook";
import { TransitionGroup } from "react-transition-group";
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import { themeLight, Box, Flex, Text, Link } from '@makerdao/ui-components-core'
import { colors } from '@makerdao/design-system-constants'
import '@makerdao/ui-components-core/dist/styles/global.css'
import MakerProvider from '../providers/MakerProvider';

import theme from '../utils/theme'

const GlobalStyle = createGlobalStyle`
  html {
    min-height: 100%;
  }
  body {
    background-color: ${colors.lightGrey};
  }
`

export default class MyApp extends App {
  render () {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <GlobalStyle/>
        <ThemeProvider theme={theme}>
          <MakerProvider
              rpcUrl='https://kovan.infura.io/v3/58073b4a32df4105906c702f167b91d2'
              network='kovan'
          >
            <ModalProvider container={TransitionGroup}>
              <Component {...pageProps} />
            </ModalProvider>
          </MakerProvider>
        </ThemeProvider>
      </Container>
    )
  }
}
