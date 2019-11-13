import React, { useEffect, useState } from 'react';
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
import useMaker from '../../hooks/useMaker';
import useValidatedInput from '../../hooks/useValidatedInput';
import { TextBlock } from '../Typography';

export default ({ onNext, onPrev }) => {
  const [{ saiBalance }] = useStore();
  const [maxLiquidity, setMaxLiquidity] = useState(null);
  const maxOverall = Math.min(
    saiBalance && saiBalance.toNumber(),
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
        return amount > saiBalance.toNumber()
          ? 'Insufficient Sai balance'
          : 'Amount exceeds Dai availibility';
      }
    }
  );
  const [, dispatch] = useStore();
  const { maker } = useMaker();
  useEffect(() => {
    (async () => {
      if (!maker) return;
      const daiToken = maker.service('token').getToken('MDAI');
      const [systemWideDebtCeiling, daiSupply] = await Promise.all([
        maker.service('mcd:systemData').getSystemWideDebtCeiling(),
        daiToken.totalSupply().then(s => s.toNumber())
      ]);
      const saiIlk = maker.service('mcd:cdpType').getCdpType(null, 'SAI');
      const saiDebtCeiling = saiIlk.debtCeiling.toNumber();
      const saiIlkDebt = saiIlk.totalDebt.toNumber();
      const systemDebtCeilingRemaining = systemWideDebtCeiling - daiSupply;
      const saiIlkDebtCeilingRemaining = saiDebtCeiling - saiIlkDebt;
      setMaxLiquidity(
        Math.min(systemDebtCeilingRemaining, saiIlkDebtCeilingRemaining)
      );
    })();
  }, [maker]);

  return (
    <Grid maxWidth="912px" gridRowGap="m" px={['s', 0]}>
      <Text.h2 textAlign="center">Upgrade Single Collateral Dai</Text.h2>
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
        <Card px={{ s: 'm', m: 'l' }} py={{ s: 'm', m: 'l' }}>
          <Grid gridRowGap="s">
            <TextBlock t="h5" lineHeight="normal">
              Enter the amount you would like to upgrade.
            </TextBlock>
            <Input
              type="number"
              value={amount}
              disabled={!saiBalance}
              min="0"
              placeholder="0.00 SAI"
              onChange={onAmountChange}
              failureMessage={amountErrors}
              after={
                <Link fontWeight="medium" onClick={() => setAmount(maxOverall)}>
                  Set max
                </Link>
              }
            />
            <Grid gridRowGap="xs">
              <Box>
                <Text t="subheading">Sai Balance</Text>
                <Text
                  t="caption"
                  display="inline-block"
                  ml="s"
                  color="darkLavender"
                >
                  {saiBalance
                    ? `${saiBalance.toNumber().toFixed(2)} SAI`
                    : '...'}
                </Text>
              </Box>
            </Grid>
          </Grid>
        </Card>
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
                {maxLiquidity ? `${maxLiquidity.toFixed(2)} Dai` : '...'}
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
                saiAmountToMigrate: amount
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
