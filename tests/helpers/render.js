import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import MakerProvider from '../../providers/MakerProvider';
import StoreProvider from '../../providers/StoreProvider';
import WalletProvider from '../../providers/WalletProvider';
import theme from '../../utils/theme';

export default function renderWithProviders(children) {
  return render(
    <ThemeProvider theme={theme}>
      <MakerProvider>
        <StoreProvider>
          <WalletProvider>{children}</WalletProvider>
        </StoreProvider>
      </MakerProvider>
    </ThemeProvider>
  );
}
