import React, { useState } from 'react';
import { Text, Button, Grid, Card, Box } from '@makerdao/ui-components-core';
import useStore from '../../hooks/useStore';
import { TextBlock } from '../Typography';
import { prettifyNumber } from '../../utils/ui';
import { DAI } from '../../maker';
import AmountInputCard from '../AmountInputCard';

export default ({ onNext, onPrev }) => {
  let [{ daiBalance, saiAvailable }, dispatch] = useStore();
  saiAvailable = saiAvailable.toBigNumber();
  const [daiAmountToMigrate, setDaiAmountToMigrate] = useState();
  const [valid, setValid] = useState(true);
  const max = daiBalance.lt(saiAvailable) ? daiBalance : DAI(saiAvailable);

  const getErrorMessage = value => {
    if (value.lte(0)) return 'Amount must be greater than 0';
    else if (value.gt(daiBalance)) return 'Insufficient Dai balance';
    else if (value.gt(saiAvailable)) return 'Amount exceeds Sai availability';
  };

  return (
    <Grid maxWidth="912px" gridRowGap="m" px={['s', 0]}>
      <Text.h2 textAlign="center">Convert Dai to Sai</Text.h2>
      <Text.p
        textAlign="center"
        t="body"
        fontSize="1.8rem"
        m="0 auto"
        display={{ s: 'none', m: 'block' }}
      >
        How much Dai would you like to convert to Single-Collateral Sai?
      </Text.p>
      <Grid
        gridTemplateColumns={{ s: 'minmax(0, 1fr)', l: '2fr 1fr' }}
        gridGap="m"
        my={{ s: 's', l: 'l' }}
      >
        <AmountInputCard
          max={max}
          unit={DAI}
          setValid={setValid}
          update={setDaiAmountToMigrate}
          getErrorMessage={getErrorMessage}
          title="Enter the amount you would like to exchange."
        >
          <Box>
            <Text t="subheading">Dai Balance</Text>
            <Text
              t="caption"
              display="inline-block"
              ml="s"
              color="darkLavender"
            >
              {daiBalance ? prettifyNumber(daiBalance) : '...'}
            </Text>
          </Box>
        </AmountInputCard>
        <Card px={{ s: 'm', m: 'l' }} py={{ s: 'm', m: 'l' }}>
          <Grid gridRowGap="m">
            <Grid gridRowGap="xs">
              <TextBlock t="h5" lineHeight="normal">
                DAI to SAI exchange rate
              </TextBlock>
              <TextBlock t="body">1:1</TextBlock>
            </Grid>
            <Grid gridRowGap="xs">
              <TextBlock t="h5" lineHeight="normal">
                Max DAI to SAI availability
              </TextBlock>
              <TextBlock t="body">
                {saiAvailable ? `${prettifyNumber(saiAvailable)}` : '...'}
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
          disabled={!daiAmountToMigrate || !valid}
          onClick={() => {
            dispatch({ type: 'assign', payload: { daiAmountToMigrate } });
            onNext();
          }}
        >
          Continue
        </Button>
      </Grid>
    </Grid>
  );
};
