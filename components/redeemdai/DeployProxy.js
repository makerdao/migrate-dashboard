import React, { useState, useEffect } from 'react';
import { Box, Text, Button, Grid } from '@makerdao/ui-components-core';
import useProxy from '../../hooks/useProxy';
import useBlockHeight from '../../hooks/useBlockHeight';
import ProxyComponent from '../ProxyComponent';
import useMaker from '../../hooks/useMaker';
import useStore from '../../hooks/useStore';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import { addToastWithTimeout } from '../Toast';

function DeployProxy({ onPrev, onNext, showErrorMessageAndAllowExiting }) {
  const [
    { proxyDaiAllowance, daiBalance, endBalance, dsrBalance },
    dispatch
  ] = useStore();
  const alreadyHasAllowance = proxyDaiAllowance.gt(
    daiBalance.plus(dsrBalance.plus(endBalance))
  );
  
  const { maker } = useMaker();
  const {
    proxyAddress,
    setupProxy,
    proxyLoading,
    startingBlockHeight,
    proxyDeployed,
    proxyErrors,
    hasProxy
  } = useProxy();

  const giveProxyDaiAllowance = async () => {
    setAllowanceLoading(true);
    try {
      if (!proxyAddress) {
        throw new Error('No Proxy');
      }
      await maker.getToken(MDAI).approveUnlimited(proxyAddress);
      setHasAllowance(true);
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `unlock dai tx failed ${message}`;
      console.error(errMsg);
      addToastWithTimeout(errMsg, dispatch);
    }
    setAllowanceLoading(false);
  };

  const [hasAllowance, setHasAllowance] = useState(alreadyHasAllowance);
  const [allowanceLoading, setAllowanceLoading] = useState(false);

  const blockHeight = useBlockHeight(0);

  const labels = {
    setup_text:
      'Proxies are used to bundle multiple transactions into one, saving transaction time and gas costs. This only has to be done once.',
    confirmations_text: `
      Waiting for confirmations... ${
        startingBlockHeight === 0
          ? 0
          : blockHeight - startingBlockHeight > 10
          ? 10
          : blockHeight - startingBlockHeight
      } of 10`
  };

  useEffect(() => {
    if (alreadyHasAllowance) onNext();
  }, [alreadyHasAllowance, onNext]);

  return (
    <Box maxWidth="71.8rem" mx={['s', 0]}>
      <Text.h2 textAlign="center" mb="xl">
        Set up proxy contract
      </Text.h2>
      <ProxyComponent
        proxyAddress={proxyAddress}
        deployProxy={setupProxy}
        labels={labels}
        proxyLoading={proxyLoading}
        proxyDeployed={proxyDeployed}
        proxyErrors={proxyErrors}
        hasAllowance={hasAllowance}
        allowanceLoading={allowanceLoading}
        giveAllowance={giveProxyDaiAllowance}
      />
      <Grid
        justifySelf="center"
        justifyContent="center"
        gridTemplateColumns="auto auto"
        gridColumnGap="m"
      >
        <Button variant="secondary-outline" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!hasProxy || !hasAllowance}>
          Continue
        </Button>
      </Grid>
    </Box>
  );
}

export default DeployProxy;
