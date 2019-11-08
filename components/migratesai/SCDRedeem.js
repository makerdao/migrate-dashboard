import React, { useEffect, useState } from 'react';
import { Box, Text, Button, Grid, Card, Input, Link } from '@makerdao/ui-components-core';
import useStore from '../../hooks/useStore';
import useMaker from '../../hooks/useMaker';
import useValidatedInput from '../../hooks/useValidatedInput';

export default ({
  onNext,
  onPrev
}) => {
  const [{ saiBalance }] = useStore();
  const [amount, setAmount, onAmountChange, amountErrors] = useValidatedInput(
    '',
    {
      maxFloat: saiBalance && saiBalance.toNumber(),
      minFloat: 0,
      isFloat: true
    },
    {
      maxFloat: () =>
        "Insufficient SAI balance"
    }
  );
  const [maxLiquidity, setMaxLiquidity] = useState(null);
  const [{},dispatch] = useStore();
  const { maker } = useMaker();
   useEffect(() => {
    (async () => {
      if (!maker) return;
      const daiToken = maker.service('token').getToken('MDAI');
      const [systemWideDebtCeiling, daiSupply] = await Promise.all([
      	maker.service('mcd:systemData').getSystemWideDebtCeiling(),
      	daiToken.totalSupply().then(s => s.toNumber())
      ])
      const saiIlk = maker.service('mcd:cdpType').getCdpType(null,'SAI');
      const saiDebtCeiling = saiIlk.debtCeiling.toNumber();
      const saiIlkDebt = saiIlk.totalDebt.toNumber();
      const systemDebtCeilingRemaining = systemWideDebtCeiling - daiSupply;
      const saiIlkDebtCeilingRemaining = saiDebtCeiling - saiIlkDebt;
      setMaxLiquidity(Math.min(systemDebtCeilingRemaining, saiIlkDebtCeilingRemaining));
    })();
  }, [maker]);

  return (
    <Box maxWidth="71.8rem" mx={['s', 0]}>
      <Text.h2 textAlign="center" mb="xl">
        Upgrade Single Collateral Dai
      </Text.h2>
      <Text textAlign="center" mb="xl">
        How much Single-collateral Dai would you like to upgrade to Multi-collateral Dai
      </Text>
      <Card px={{ s: 'l', m: '2xl' }} py="l" mb="xl">
      <Text>
      	Enter the amount you would like to upgrade.
      </Text>
      	 <Input
          type="number"
          value={amount}
          min="0"
          placeholder="0.00 SAI"
          onChange={onAmountChange}
          failureMessage={amountErrors}
          after={<Link fontWeight="medium" onClick={() => setAmount(saiBalance.toNumber())}>
      				Set max
    			</Link>}
         />
       <Text.p>
      	Sai Balance
      </Text.p>
      <Text.p>
      {saiBalance ? `${saiBalance.toNumber().toFixed(2)} SAI` : '...'}
      </Text.p>
      </Card>
      <Card px={{ s: 'l', m: '2xl' }} py="l" mb="xl">
      <Text.p>
      	SAI to DAI exchange rate
      </Text.p>
       <Text.p>
      	1:1
      </Text.p>
      <Text.p>
      Max SAI to DAI Liquidity
      </Text.p>
      <Text.p>
      {maxLiquidity ? `${maxLiquidity.toFixed(2)} Dai` : '...'}
      </Text.p>
      </Card>
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
        onClick={()=>{
        	dispatch({
		        type: 'assign',
		        payload: {
		        	saiAmountToMigrate: amount
		        }
		      });
        	onNext();
        }}>
          Continue
        </Button>
      </Grid>
    </Box>
  );
};
