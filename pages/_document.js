import { ThemeProvider } from 'styled-components';
import NextDocument, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import useMaker from '../hooks/useMaker';

export default class MyDocument extends NextDocument {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const page = renderPage(App => props =>
      sheet.collectStyles(<App {...props} />)
    );
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }

  render() {
    return (
      <html>
        <Head>{this.props.styleTags}</Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
