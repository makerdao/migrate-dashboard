import React, { useState } from 'react';
import { Text, Button, Grid, Card, Box } from '@makerdao/ui-components-core';
import useStore from '../../hooks/useStore';
import { TextBlock } from '../Typography';
import { prettifyNumber } from '../../utils/ui';
import { SAI, DAI } from '../../maker';
import AmountInputCard from '../AmountInputCard';

export default ({ onNext, onPrev }) => {
  let [{ saiBalance = SAI(0)}, dispatch] = useStore();
  // if (saiAvailable) saiAvailable = saiAvailable.toBigNumber();
  const [saiAmountToRedeem, setSaiAmountToRedeem] = useState();
  const [valid, setValid] = useState(true);
  const max = saiBalance
  const exchangeRate = 0

  const validate = value => {
    let msg;
    if (value.lte(0)) msg = 'Amount must be greater than 0';
    else if (value.gt(saiBalance)) msg = 'Insufficient Sai balance';
    else if (value.gt(saiAvailable)) msg = 'Amount exceeds Collateral availability';
    setValid(!msg);
    return msg;
  };

  return (
    <Grid maxWidth="912px" gridRowGap="m" px={['s', 0]}>
      <Text.h2 textAlign="center">Redeem Sai for Collateral</Text.h2>
      <Text.p
        textAlign="center"
        t="body"
        fontSize="1.8rem"
        m="0 auto"
        display={{ s: 'none', m: 'block' }}
      >
        Redeem your SAI for a proportional amount of ETH from the Single-Collateral Dai system.
      </Text.p>
      <Grid
        gridTemplateColumns={{ s: 'minmax(0, 1fr)', l: '2fr 1fr' }}
        gridGap="m"
        my={{ s: 's', l: 'l' }}
      >
        <AmountInputCard
          max={max}
          unit={DAI}
          update={setSaiAmountToRedeem}
          validate={validate}
          title="Enter the amount you would like to redeem."
        >
          <Box>
            <Text t="subheading">Sai Balance</Text>
            <Text
              t="caption"
              display="inline-block"
              ml="s"
              color="darkLavender"
            >
              {saiBalance ? prettifyNumber(saiBalance) : '...'}
            </Text>
          </Box>
        </AmountInputCard>
        <Card px={{ s: 'm', m: 'l' }} py={{ s: 'm', m: 'l' }}>
          <Grid gridRowGap="m">
            <Grid gridRowGap="xs">
              <TextBlock t="h5" lineHeight="normal">
                SAI Balance
              </TextBlock>
              <TextBlock t="body">{`${saiBalance} SAI`}</TextBlock>
            </Grid>
            <Grid gridRowGap="xs">
              <TextBlock t="h5" lineHeight="normal">
                Exchange Rate
              </TextBlock>
              {/*//TODO */}
              <TextBlock t="body">1 SAI : 0.005 ETH</TextBlock>
            </Grid>
            <Grid gridRowGap="xs">
              <TextBlock t="h5" lineHeight="normal">
                SAI Balance in ETH
              </TextBlock>
              <TextBlock t="body">
                {saiBalance * exchangeRate}
              </TextBlock>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid
        justifySelf="center"
        justifyContent="center"
        gridTemplateColumns="auto auto"
        gridColumnGap="m"
      >
        <Button variant="secondary-outline" onClick={onPrev}>
          Cancel
        </Button>
        <Button
          disabled={!saiAmountToRedeem || !valid}
          onClick={() => {
            dispatch({ type: 'assign', payload: { saiAmountToRedeem } });
            onNext();
          }}
        >
          Continue
        </Button>
      </Grid>
    </Grid>
  );
};
