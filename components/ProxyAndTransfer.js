import React, { useState, useCallback } from 'react';
import {
  Text,
  Card,
  Button,
  Grid,
  Tooltip
} from '@makerdao/ui-components-core';

import TooltipContents from './TooltipContents';
import SuccessButton from './SuccessButton';
import useMaker from '../hooks/useMaker';

const ProxyAndTransfer = ({
  proxyAddress,
  deployProxy,
  proxyLoading,
  proxyDeployed,
  proxyErrors,
  labels,
  selectedCDP,
  cdpTransferred,
  setCDPTransferred,
  showErrorMessageAndAllowExiting
}) => {
  const { setup_text, confirmations_text } = labels;
  const [isTransferringCDP, setIsTransferringCDP] = useState(false);
  const { maker } = useMaker();
  if (proxyErrors) showErrorMessageAndAllowExiting();
  const transferCDP = useCallback(async () => {
    try {
      const address =
        proxyAddress || (await maker.service('proxy').getProxyAddress());
      const give = selectedCDP.give(address);
      setIsTransferringCDP(true);
      await give;
      setCDPTransferred(true);
      setIsTransferringCDP(false);
    } catch (err) {
      setIsTransferringCDP(false);
      console.error('cdp transfer tx failed', err);
      showErrorMessageAndAllowExiting();
    }
  }, [
    maker,
    proxyAddress,
    selectedCDP,
    setCDPTransferred,
    showErrorMessageAndAllowExiting
  ]);
  return (
    <Card px={{ s: 'l', m: '2xl' }} py="l" mb="xl">
      <Grid gridRowGap="xs">
        <Text.h4>Deploy proxy</Text.h4>
        <Text.p color="darkLavender" fontSize="l" lineHeight="normal">
          {setup_text}
        </Text.p>
        {proxyAddress ? (
          <SuccessButton />
        ) : (
          <Button
            justifySelf={['center', 'left']}
            width={['26.0rem', '13.0rem']}
            mt="xs"
            onClick={deployProxy}
            disabled={proxyLoading || isTransferringCDP || !!proxyErrors}
            loading={proxyLoading || !!proxyErrors}
          >
            Deploy
          </Button>
        )}
        <Text.p t="subheading" lineHeight="normal">
          {proxyLoading && confirmations_text}
          {proxyDeployed && 'Confirmed with 10 confirmations'}
          {(proxyLoading || proxyDeployed) && (
            <Tooltip
              fontSize="m"
              ml="2xs"
              content={
                <TooltipContents>
                  Waiting for confirmations reduces the risk of your Maker
                  Collateral Vault address changing. We require users to wait 10
                  block confirmations to ensure it's been created successfully.
                  This will often take around 2 minutes.
                </TooltipContents>
              }
            />
          )}
        </Text.p>
      </Grid>
      <Grid gridRowGap="xs" mt="l">
        <Text.h4>Transfer CDP ownership to proxy</Text.h4>
        <Text.p color="darkLavender" fontSize="l" lineHeight="normal">
          Proxies are used to bundle multiple transactions into one, saving
          transaction time and gas costs. This only has to be done once.
        </Text.p>
        {cdpTransferred ? (
          <SuccessButton />
        ) : (
          <Button
            px={'s'}
            justifySelf={['center', 'left']}
            width={['26.0rem', '13.0rem']}
            mt="xs"
            onClick={transferCDP}
            disabled={!proxyAddress || proxyLoading || isTransferringCDP}
            loading={isTransferringCDP}
          >
            Transfer CDP
          </Button>
        )}
      </Grid>
    </Card>
  );
};

export default ProxyAndTransfer;
