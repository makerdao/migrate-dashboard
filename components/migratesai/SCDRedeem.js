import React from 'react';
import { Box, Text, Button, Grid, Card, Input, Link } from '@makerdao/ui-components-core';
import useStore from '../../hooks/useStore';
import useValidatedInput from '../../hooks/useValidatedInput';


function SetMax({ ...props }) {
  return (
    <Link fontWeight="medium" {...props}>
      Set max
    </Link>
  );
}

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
  const [{},dispatch] = useStore();
  return (
    <Box maxWidth="71.8rem" mx={['s', 0]}>
      <Text.h2 textAlign="center" mb="xl">
        Upgrade Single Collateral Dai
      </Text.h2>
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
          after={<Link fontWeight="medium" onClick={() => setAmount(saiBalance)}>
      				Set max
    			</Link>}
         />
       <Text>
      	Sai Balance
      </Text>
      <Text>
      {saiBalance ? `${saiBalance.toNumber().toFixed(2)} SAI` : '...'}
      </Text>
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
        	console.log('dispatch', dispatch);
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
