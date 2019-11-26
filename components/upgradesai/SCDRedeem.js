import React, { useState } from 'react';
import { Box, Text, Button, Grid, Card } from '@makerdao/ui-components-core';
import useStore from '../../hooks/useStore';
import { TextBlock } from '../Typography';
import { prettifyNumber } from '../../utils/ui';
import { SAI } from '../../maker';
import AmountInputCard from '../AmountInputCard';

export default ({ onNext, onPrev }) => {
  let [{ saiBalance, daiAvailable }, dispatch] = useStore();
  if (daiAvailable) daiAvailable = daiAvailable.toBigNumber();
  const [saiAmountToMigrate, setSaiAmountToMigrate] = useState();
  const [valid, setValid] = useState(true);
  const max = saiBalance.lt(daiAvailable) ? saiBalance : SAI(daiAvailable);

  const validate = value => {
    let msg;
    if (value.lte(0)) msg = 'Amount must be greater than 0';
    else if (value.gt(saiBalance)) msg = 'Insufficient Sai balance';
    else if (value.gt(daiAvailable)) msg = 'Amount exceeds Dai availability';

    setValid(!msg);
    return msg;
  };

  return (
    <Grid maxWidth="912px" gridRowGap="m" px={['s', 0]}>
      <Text.h2 textAlign="center">Upgrade Single-Collateral Sai</Text.h2>
      <Text.p
        textAlign="center"
        t="body"
        fontSize="1.8rem"
        m="0 auto"
        display={{ s: 'none', m: 'block' }}
      >
        How much Single-collateral Sai would you like to upgrade to
        Multi-collateral Dai?
      </Text.p>
      <Grid
        gridTemplateColumns={{ s: 'minmax(0, 1fr)', l: '2fr 1fr' }}
        gridGap="m"
        my={{ s: 's', l: 'l' }}
      >
        <AmountInputCard
          max={max}
          unit={SAI}
          update={setSaiAmountToMigrate}
          validate={validate}
          title="Enter the amount you would like to upgrade."
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
                SAI to DAI exchange rate
              </TextBlock>
              <TextBlock t="body">1:1</TextBlock>
            </Grid>
            <Grid gridRowGap="xs">
              <TextBlock t="h5" lineHeight="normal">
                Max SAI to DAI availability
              </TextBlock>
              <TextBlock t="body">
                {daiAvailable ? prettifyNumber(daiAvailable) : '...'}
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
          disabled={!saiAmountToMigrate || !valid}
          onClick={() => {
            dispatch({ type: 'assign', payload: { saiAmountToMigrate } });
            onNext();
          }}
        >
          Continue
        </Button>
      </Grid>
    </Grid>
  );
};
