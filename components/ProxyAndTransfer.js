import React from 'react';
import {
  Text,
  Card,
  Button,
  Grid,
  Tooltip
} from '@makerdao/ui-components-core';

const lang = {};

import { ReactComponent as Checkmark } from '../images/checkmark.svg';
import TooltipContents from './TooltipContents';
import SuccessButton from './SuccessButton';

const ProxySuccessButton = () => {
  return (
    <Button variant="primary-outline" width="13.0rem" mt="xs" disabled>
      <Checkmark />
    </Button>
  );
};

const ProxyAndTransfer = ({
  proxyAddress,
  deployProxy,
  proxyLoading,
  proxyDeployed,
  proxyErrors,
  setAllowance,
  hasAllowance,
  labels,
  isSettingAllowance
}) => {
  const { setup_text, allowance_text, confirmations_text } = labels;
  return (
    <Card px={{ s: 'l', m: '2xl' }} py="l" mb="xl">
      <Grid gridRowGap="xs">
        <Text.h4>Deploy proxy</Text.h4>
        <Text.p color="darkLavender" fontSize="l" lineHeight="normal">
          {setup_text}
        </Text.p>
        {proxyAddress ? (
          <SuccessButton/>
        ) : (
          <Button
            width="13.0rem"
            mt="xs"
            onClick={deployProxy}
            disabled={proxyLoading || isSettingAllowance || !!proxyErrors}
            loading={proxyLoading || !!proxyErrors}
          >
            Deploy
          </Button>
        )}
        <Text.p t="subheading" lineHeight="normal">
          {proxyErrors && (
            <>
              This transaction is taking longer than usual...
              <Tooltip
                fontSize="m"
                ml="2xs"
                content={
                  <TooltipContents>
                    Transactions to the network may sometimes take longer than expected. This can be for a variety of reasons but may be due to a congested network or a transaction sent with a low gas price. Some wallets enable users to resend a transaction with a higher gas price, otherwise check for your transaction on etherscan and come back again later
                  </TooltipContents>
                }
              />
            </>
          )}
          {proxyLoading && confirmations_text}
          {proxyDeployed &&
            "Confirmed with 10 confirmations"}
          {(proxyLoading || proxyDeployed) && (
            <Tooltip
              fontSize="m"
              ml="2xs"
              content={
                <TooltipContents>
                  Waiting for confirmations reduces the risk of your Maker Collateral Vault address changing. We require users to wait 10 block confirmations to ensure it's been created successfully. This will often take around 2 minutes.
                </TooltipContents>
              }
            />
          )}
        </Text.p>
      </Grid>
    </Card>
  );
};

export default ProxyAndTransfer;