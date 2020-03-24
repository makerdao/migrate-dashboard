import React from 'react';
import { Box, Text, Button, Grid } from '@makerdao/ui-components-core';
import useProxy from '../../hooks/useProxy';
import useBlockHeight from '../../hooks/useBlockHeight';
import ProxyComponent from '../ProxyComponent';

function DeployProxy({ onPrev, onNext, showErrorMessageAndAllowExiting }) {
  const {
    proxyAddress,
    setupProxy,
    proxyLoading,
    startingBlockHeight,
    proxyDeployed,
    proxyErrors,
    hasProxy
  } = useProxy();

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
        showErrorMessageAndAllowExiting={showErrorMessageAndAllowExiting}
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
        <Button onClick={onNext} disabled={!hasProxy}>
          Continue
        </Button>
      </Grid>
    </Box>
  );
}

export default DeployProxy;