import React, { useState } from 'react';
import { Text, Button, Grid, Card, Box } from '@makerdao/ui-components-core';
import useStore from '../../hooks/useStore';
import { TextBlock } from '../Typography';
import { prettifyNumber } from '../../utils/ui';
import { SAI, DAI } from '../../maker';
import AmountInputCard from '../AmountInputCard';

export default ({ onNext, onPrev }) => {
  let [
    { saiBalance = SAI(0), pethInVaults, pethInAccount, totalPeth },
    dispatch
  ] = useStore();
  const [saiAmountToRedeem, setSaiAmountToRedeem] = useState();
  const [valid, setValid] = useState(true);
  const shutdownPethEthRatio = 0;
  const currentPethEthRatio = 0;
  const estimatedPethEthRatio = 0;
  const redeemedCollateral = totalPeth * currentPethEthRatio;

  return (
    <Grid maxWidth="912px" gridRowGap="m" px={['s', 0]}>
      <Text.h2 textAlign="center">Withdraw collateral from Sai Vault</Text.h2>
      <Text.p
        textAlign="center"
        t="body"
        fontSize="1.8rem"
        m="0 auto"
        display={{ s: 'none', m: 'block' }}
      >
        The cooldown period has now ended and it is possible to withdraw
        collateral from your Sai Vault.
      </Text.p>
      <Grid
        gridTemplateColumns={{ s: 'minmax(0, 1fr)', l: '2fr 1fr' }}
        gridGap="m"
        my={{ s: 's', l: 'l' }}
      >
        <TextBlock t="h5" lineHeight="normal">
          Please note the following:
        </TextBlock>
        <Grid gridRowGap="m">
          <Grid gridRowGap="xs" gridTemplateColumns="1fr 1fr">
            <TextBlock t="h5" lineHeight="normal">
              The PETH:ETH ratio at the time of emergency shutdown was
            </TextBlock>
            <Box>
              <TextBlock t="body">{shutdownPethEthRatio}</TextBlock>
            </Box>
          </Grid>
          <Grid gridRowGap="xs" gridTemplateColumns="1fr 1fr">
            <TextBlock t="h5" lineHeight="normal">
              The current PETH:ETH ratio is
            </TextBlock>
            <Box>
              <TextBlock t="body">{currentPethEthRatio}</TextBlock>
            </Box>
          </Grid>
          <Grid gridRowGap="xs" gridTemplateColumns="1fr 1fr">
            <TextBlock t="h5" lineHeight="normal">
              The PETH:ETH ratio once the debt of all Vaults have been bitten is
              estimated at
            </TextBlock>
            <Box>
              <TextBlock t="body">{estimatedPethEthRatio}</TextBlock>
            </Box>
          </Grid>
        </Grid>
        <TextBlock>WARNING!</TextBlock>
        <TextBlock>
          It is recommended that users wait to withdraw their collateral until
          the PETH:ETH ratio is equal to or better than the ratio at the time of
          emergency shutdown in order to receive a favourable exchange rate.
          This ratio is an indication that the debt in the system has been
          accounted for at which point in time the user will be able to claim
          the most amount of ETH for every unit of PETH that they hold.
        </TextBlock>
      </Grid>
      <Box>
        <Grid gridGap="m" gridTemplateColumns="1fr 1fr">
          <TextBlock>PETH in vaults</TextBlock>
          <TextBlock>{pethInVaults}</TextBlock>
          <TextBlock>PETH in account</TextBlock>
          <TextBlock>{pethInAccount}</TextBlock>
          <TextBlock>Total PETH balance</TextBlock>
          <TextBlock>{totalPeth}</TextBlock>
          <TextBlock>Total Value in ETH</TextBlock>
          <TextBlock>{`${redeemedCollateral} ETH`}</TextBlock>
        </Grid>
      </Box>
      <Box>
        <TextBlock>Redeem full amount of ETH</TextBlock>
        <Grid
          justifySelf="center"
          justifyContent="center"
          gridTemplateColumns="auto auto"
          gridColumnGap="m"
        >
          <Button variant="secondary-outline" onClick={onPrev}>
            Back
          </Button>
          <Button
            // disabled={!collateralAmountToRedeem || !valid}
            onClick={() => {
              dispatch({
                type: 'assign',
                payload: {
                  redeemedCollateral,
                  pethEthRatio: currentPethEthRatio,
                  totalPeth
                }
              });
              onNext();
            }}
          >
            Yes
          </Button>
        </Grid>
      </Box>
    </Grid>
  );
};
