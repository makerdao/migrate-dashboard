import { useState } from 'react';
import { Box, Text, Card, Button, Grid } from '@makerdao/ui-components-core';
import SuccessButton from '../SuccessButton';
import useProxy from '../../hooks/useProxy';
import useBlockHeight from '../../hooks/useBlockHeight';
import ProxyAndTransfer from '../ProxyAndTransfer';

function DeployProxy({ onPrev, onNext, selectedCDP }) {
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
  console.log('startingBlockHeight', startingBlockHeight);
  console.log('blockHeight', blockHeight);
  async function deployProxy() {
    await setupProxy();
    // dispatch({
    //   type: 'set-proxy-address',
    //   payload: { address: proxyAddress }
    // });
  }

  const labels = {
    setup_text: "Proxies are used in the CDP Portal to bundle multiple transactions into one, saving transaction time and gas costs. This only has to be done once.",
    confirmations_text: `
      Waiting for confirmations... ${startingBlockHeight === 0
        ? 0
        : blockHeight - startingBlockHeight > 10
        ? 10
        : blockHeight - startingBlockHeight} of 10`
  };

  return (
    <Box maxWidth="71.8rem">
      <Text.h2 textAlign="center" mb="xl">
        Set up proxy contract
      </Text.h2>
      <ProxyAndTransfer
        proxyAddress={proxyAddress}
        deployProxy={deployProxy}
        labels={labels}
        proxyLoading={proxyLoading}
        proxyDeployed={proxyDeployed}
        proxyErrors={proxyErrors}
        selectedCDP={selectedCDP}
      />
      <Grid
        justifySelf="center"
        justifyContent="center"
        gridTemplateColumns="auto auto"
        gridColumnGap="m"
      >
        <Button variant="secondary-outline" onClick={onPrev}>
          Cancel
        </Button>
        <Button onClick={onNext} disabled={!hasProxy}>
          Continue
        </Button>
      </Grid>
    </Box>
  );
}

export default DeployProxy;
