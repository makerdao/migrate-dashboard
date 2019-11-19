import { Fragment } from 'react';
import { render as renderBase } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import MakerProvider from '../../providers/MakerProvider';
import StoreProvider from '../../providers/StoreProvider';
import WalletProvider from '../../providers/WalletProvider';
import useStore from '../../hooks/useStore';
import theme from '../../utils/theme';

export default async function render(children, { initialState } = {}) {
  let callback;
  const promise = new Promise(resolve => {
    callback = (state, dispatch) => resolve([state, dispatch]);
  });

  const renderResults = renderBase(
    <ThemeProvider theme={theme}>
      <MakerProvider>
        <StoreProvider initialState={initialState}>
          <WalletProvider>
            <StoreAccess callback={callback}>{children}</StoreAccess>
          </WalletProvider>
        </StoreProvider>
      </MakerProvider>
    </ThemeProvider>
  );

  const [state, dispatch] = await promise;
  return { ...renderResults, state, dispatch };
}

function StoreAccess({ callback, children }) {
  const [state, dispatch] = useStore();
  if (callback) callback(state, dispatch);
  return <Fragment>{children}</Fragment>;
}
