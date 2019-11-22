import React from 'react';
import {
  Box,
  Text,
  Button,
  Grid,
  Card,
  Input,
  Link
} from '@makerdao/ui-components-core';
import useStore from '../../hooks/useStore';
import useValidatedInput from '../../hooks/useValidatedInput';
import { TextBlock } from '../Typography';
import { prettifyNumber } from '../../utils/ui';
import { DAI } from '../../maker';

export default ({ onNext, onPrev }) => {
  const [{ daiBalance, maxLiquidity }, dispatch] = useStore();
  const maxOverall = Math.min(
    daiBalance && daiBalance.toNumber(),
    maxLiquidity
  );
  const [amount, setAmount, onAmountChange, amountErrors] = useValidatedInput(
    '',
    {
      maxFloat: maxOverall,
      minFloat: 0,
      isFloat: true
    },
    {
      maxFloat: amount => {
        return amount > daiBalance.toNumber()
          ? 'Insufficient Dai balance'
          : 'Amount exceeds Sai availibility';
      }
    }
  );

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
        <Card px={{ s: 'm', m: 'l' }} py={{ s: 'm', m: 'l' }}>
          <Grid gridRowGap="m">
            <TextBlock t="h5" lineHeight="normal">
              Enter the amount you would like to exchange.
            </TextBlock>
            <Input
              type="number"
              value={amount}
              disabled={!daiBalance}
              min="0"
              placeholder="0.00 DAI"
              onChange={onAmountChange}
              failureMessage={amountErrors}
              // after={
              //   <Link
              //     color="blue"
              //     fontWeight="medium"
              //     onClick={() => setAmount(maxOverall)}
              //   >
              //     Set max
              //   </Link>
              // }
            />
            <Grid gridRowGap="xs">
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
            </Grid>
          </Grid>
        </Card>
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
                {maxLiquidity ? `${prettifyNumber(maxLiquidity)} Sai` : '...'}
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
          disabled={!amount || amountErrors}
          onClick={() => {
            dispatch({
              type: 'assign',
              payload: {
                daiAmountToMigrate: DAI(amount)
              }
            });
            onNext();
          }}
        >
          Continue
        </Button>
      </Grid>
    </Grid>
  );
};
