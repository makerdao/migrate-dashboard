import React from 'react';
import {
  Text,
  Card,
  Button,
  Grid,
  Tooltip
} from '@makerdao/ui-components-core';

import TooltipContents from './TooltipContents';
import SuccessButton from './SuccessButton';

const ProxyComponent = ({
  proxyAddress,
  deployProxy,
  proxyLoading,
  proxyDeployed,
  proxyErrors,
  hasAllowance,
  allowanceLoading,
  giveAllowance,
  labels,
  showErrorMessageAndAllowExiting
}) => {
  const { setup_text, confirmations_text } = labels;
  if (proxyErrors) showErrorMessageAndAllowExiting();
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
            disabled={proxyLoading || !!proxyErrors}
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
                  Waiting for confirmations reduces the risk of your proxy address changing. We require users to wait 10
                  block confirmations to ensure it's been created successfully.
                  This will often take around 2 minutes.
                </TooltipContents>
              }
            />
          )}
        </Text.p>
      </Grid>
      <Grid gridRowGap="xs" mt="l">
        <Text.h4>Set Allowance</Text.h4>
        <Text.p color="darkLavender" fontSize="l" lineHeight="normal">
          This permission allows your proxy to interact with your DAI. This only has to be done once.
        </Text.p>
        {hasAllowance ? (
          <SuccessButton />
        ) : (
          <Button
            width="13.0rem"
            mt="xs"
            onClick={giveAllowance}
            disabled={!proxyAddress || proxyLoading || allowanceLoading}
            loading={allowanceLoading}
          >
            Set
          </Button>
        )}
      </Grid>
    </Card>
  );
};

export default ProxyComponent;