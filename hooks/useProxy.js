import { useReducer, useEffect } from 'react';

import useActionState from './useActionState';
import useBlockHeight from './useBlockHeight';
import useMaker from './useMaker';

import debug from 'debug';
const log = debug('maker:useProxy');

const initialState = {
  initialProxyCheck: true,
  startingBlockHeight: 0,
  proxyAddress: undefined,
  startedWithoutProxy: false,
  proxyDeployed: false
};

export default function useProxy() {
  const lang = {};
  const { maker, account} = useMaker();
  const [
    {
      initialProxyCheck,
      startingBlockHeight,
      proxyAddress,
      startedWithoutProxy,
      proxyDeployed
    },
    updateState
  ] = useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    initialState
  );

  const [setupProxy, proxyLoading, , proxyErrors] = useActionState(async () => {
    log('proxy setup is running');
    if (!account) return null;
    if (proxyAddress) return proxyAddress;

    const txPromise = maker.service('proxy').ensureProxy();

    //newTxListener(txPromise, "Setting up proxy");
    const address = await txPromise;
    
    const txObject = maker.service('transactionManager').getTransaction(txPromise);
    const blockHeight = txObject.receipt.blockNumber;
    updateState({
      startingBlockHeight: blockHeight,
      proxyAddress: address
    });

    await maker.service('transactionManager').confirm(txPromise, 7);

    updateState({ proxyDeployed: true });
    return address;
  });

  useEffect(() => {
    if (account) {
      (async () => {
        updateState({ initialProxyCheck: true });
        const proxyAddress = await maker.service('proxy').getProxyAddress();
        log(`got proxy address: ${proxyAddress}`);
        updateState({
          initialProxyCheck: false,
          proxyAddress,
          startedWithoutProxy: !proxyAddress
        });
      })();
    }
  }, [maker, account]);

  return {
    proxyAddress,
    setupProxy,
    proxyLoading,
    initialProxyCheck,
    proxyErrors,
    startedWithoutProxy,
    startingBlockHeight,
    proxyDeployed,
    hasProxy: startedWithoutProxy ? proxyDeployed : !!proxyAddress
  };
}