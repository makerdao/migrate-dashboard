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

const proxySuccessButton = () => {
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
          <proxySuccessButton />
        ) : (
          <Button
            width="13.0rem"
            mt="xs"
            onClick={deployProxy}
            disabled={proxyLoading || isSettingAllowance || !!proxyErrors}
            loading={proxyLoading || !!proxyErrors}
          >
            todo: add text
          </Button>
        )}
        <Text.p t="subheading" lineHeight="normal">
          {proxyErrors && (
            <>
              {lang.cdp_create.proxy_failure_not_mined}
              <Tooltip
                fontSize="m"
                ml="2xs"
                content={
                  <TooltipContents>
                    {lang.cdp_create.proxy_failure_not_mined_info}
                  </TooltipContents>
                }
              />
            </>
          )}
          {proxyLoading && confirmations_text}
          {proxyDeployed &&
            lang.formatString(lang.cdp_create.confirmed_with_confirmations, 10)}
          {(proxyLoading || proxyDeployed) && (
            <Tooltip
              fontSize="m"
              ml="2xs"
              content={
                <TooltipContents>
                  {lang.cdp_create.waiting_for_confirmations_info}
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