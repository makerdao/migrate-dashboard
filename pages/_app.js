import React from 'react'
import App, { Container } from 'next/app'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import { themeLight, Box, Flex, Text, Link } from '@makerdao/ui-components-core'
import { colors } from '@makerdao/design-system-constants'
import '@makerdao/ui-components-core/dist/styles/global.css'

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
        <ThemeProvider theme={themeLight}>
          <Component {...pageProps} />
        </ThemeProvider>
      </Container>
    )
  }
}
