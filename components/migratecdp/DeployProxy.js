import React, { useState } from 'react';
import { Box, Text, Button, Grid } from '@makerdao/ui-components-core';
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

  const [cdpTransferred, setCDPTransferred] = useState(false);
  const blockHeight = useBlockHeight(0);

  const labels = {
    setup_text:
      'Proxies are used in the CDP Portal to bundle multiple transactions into one, saving transaction time and gas costs. This only has to be done once.',
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
      <ProxyAndTransfer
        proxyAddress={proxyAddress}
        deployProxy={setupProxy}
        labels={labels}
        proxyLoading={proxyLoading}
        proxyDeployed={proxyDeployed}
        proxyErrors={proxyErrors}
        selectedCDP={selectedCDP}
        cdpTransferred={cdpTransferred}
        setCDPTransferred={setCDPTransferred}
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
        <Button onClick={onNext} disabled={!hasProxy || !cdpTransferred}>
          Continue
        </Button>
      </Grid>
    </Box>
  );
}

export default DeployProxy;
