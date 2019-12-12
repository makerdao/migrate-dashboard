import { useReducer, useCallback } from 'react';
import useMaker from '../hooks/useMaker';
import { AccountTypes } from '../utils/constants';
import { addEthBalance } from '../utils/ethereum';

const TREZOR_PATH = "44'/60'/0'/0/0";

const computeAddressBalances = addresses =>
  Promise.all(
    addresses.map(address =>
      addEthBalance({
        address
      })
    )
  );

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'connect-start':
      return initialState;
    case 'fetch-start':
      return {
        ...state,
        fetching: true
      };
    case 'connect-success':
      return {
        ...state,
        fetching: false,
        onAccountChosen: payload.onAccountChosen
      };
    case 'fetch-success': {
      return {
        ...state,
        fetching: false,
        accounts: [...state.accounts, ...payload.accounts]
      };
    }
    case 'error':
      return {
        ...state,
        fetching: false
      };
    default:
      throw new Error(`Unexpected action with type '${type}'`);
  }
};

const initialState = {
  fetching: false,
  accounts: [],
  onAccountChosen: () => {}
};

const DEFAULT_ACCOUNTS_LENGTH = 25;

function useHardwareWallet({
  type,
  path,
  accountsLength = DEFAULT_ACCOUNTS_LENGTH
}) {
  const { maker } = useMaker();
  const [state, dispatch] = useReducer(reducer, initialState);

  const connect = useCallback(() => {
    dispatch({ type: 'connect-start' });
    return maker.addAccount({
      type,
      path,
      accountsOffset: 0,
      accountsLength,
      choose: async (addresses, onAccountChosen) => {
        const accounts = await computeAddressBalances(addresses);
        dispatch({ type: 'connect-success', payload: { onAccountChosen } });
        dispatch({ type: 'fetch-success', payload: { accounts, offset: 0 } });
      }
    });
  }, [accountsLength, maker, path, type]);

  const fetchMore = useCallback(
    () => {
      return new Promise((resolve, reject) => {
        dispatch({ type: 'fetch-start' });
        maker
          .addAccount({
            type,
            path,
            accountsOffset: state.accounts.length,
            accountsLength,
            choose: async addresses => {
              const accounts = await computeAddressBalances(addresses);
              dispatch({
                type: 'fetch-success',
                payload: { accounts, offset: state.accounts.length }
              });
              resolve(accounts);
            }
          })
          .catch(err => {
            dispatch({ type: 'error' });
            reject(err);
          });
      });
    },
    [accountsLength, maker, path, type, state.accounts.length]
  );

  function pickAccount(address) {
    return state.onAccountChosen(null, address);
  }

  return {
    fetchMore,
    connect,
    fetching: state.fetching,
    accounts: state.accounts,
    pickAccount
  };
}

export default useHardwareWallet;
