import { Fragment } from 'react';
import { render as renderBase } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import MakerProvider from '../../providers/MakerProvider';
import StoreProvider from '../../providers/StoreProvider';
import useMaker from '../../hooks/useMaker';
import useStore from '../../hooks/useStore';
import theme from '../../utils/theme';

export default async function render(
  children,
  {
    initialState,
    getMaker,
    network,
    // use this callback to get updates every time the store state changes
    onStateChange
  } = {}
) {
  let storeCallback;
  const storePromise = new Promise(resolve => {
    storeCallback = (state, dispatch) => {
      if (onStateChange) onStateChange(state, dispatch);
      resolve([state, dispatch]);
    };
  });

  const renderResults = renderBase(
    <ThemeProvider theme={theme}>
      <MakerProvider network={network ? network : 'mainnetfork'}>
        <MakerAccess callback={getMaker}>
          <StoreProvider initialState={initialState}>
            <StoreAccess callback={storeCallback}>{children}</StoreAccess>
          </StoreProvider>
        </MakerAccess>
      </MakerProvider>
    </ThemeProvider>
  );

  // these values are only valid for the first render
  const [state, dispatch] = await storePromise;
  return { ...renderResults, state, dispatch };
}

function StoreAccess({ callback, children }) {
  const [state, dispatch] = useStore();
  if (callback) callback(state, dispatch);
  return <Fragment>{children}</Fragment>;
}

// you can use this to get `maker` in tests but you can also just use
// `window.maker`
function MakerAccess({ callback, children }) {
  const { maker } = useMaker();
  if (callback && maker) callback(maker);
  return <Fragment>{children}</Fragment>;
}
