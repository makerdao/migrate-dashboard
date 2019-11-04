import { useState } from 'react';
import { Box, Text, Card, Button, Grid } from '@makerdao/ui-components-core';
import SuccessButton from '../SuccessButton';
import useProxy from '../../hooks/useProxy';
import ProxyAndTransfer from '../ProxyAndTransfer';

function DeployProxy({ onPrev, onNext }) {
    const {
    proxyAddress,
    setupProxy,
    proxyLoading,
    startingBlockHeight,
    proxyDeployed,
    proxyErrors,
    hasProxy
  } = useProxy();

  async function deployProxy() {
    await setupProxy();
    dispatch({
      type: 'set-proxy-address',
      payload: { address: proxyAddress }
    });
  }

  const labels = {
    setup_text: "Proxies are used in the CDP Portal to bundle multiple transactions into one, saving transaction time and gas costs. This only has to be done once.",
    allowance_text: "todo: add text",
    confirmations_text: "todo: add confirmations_text"
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
