import React, { useState, useEffect } from 'react';
import { Text, Grid, Card, Button, Box } from '@makerdao/ui-components-core';
import { DAI } from '../../maker';
import AmountInputCard from '../AmountInputCard';
import CollateralTable from './CollateralTable';
import useStore from '../../hooks/useStore';

function DaiRedeem({
  onClose,
  setRedeemAmount,
  redeemAmount,
  onNext,
  collateralData
}) {
  const [{ daiBalance }] = useStore();
  const [valid, setValid] = useState(true);

  const validate = value => {
    let msg;
    if (value.lte(0)) msg = 'Amount must be greater than 0';
    else if (value.gt(daiBalance)) msg = 'Insufficient Dai balance';

    setValid(!msg);
    return msg;
  };

  return (
    <Grid maxWidth="912px" gridRowGap="m" px={['s', 0]}>
      <Text.h2 textAlign="center">Redeem Dai for Collateral</Text.h2>
      <Text.p textAlign="center" t="body" fontSize="1.8rem" m="0 auto">
        Redeem your Dai for a proportional amount of underlying collateral from
        the Multi-Collateral Dai system.
      </Text.p>
      <Grid gridTemplateColumns="1fr 1fr 1fr">
        <div />
        <Grid width="567px" gridRowGap="l">
          <Card p="m" borderColor="#D4D9E1" border="1px solid">
            <CollateralTable data={collateralData} />
          </Card>

          <AmountInputCard
            max={daiBalance}
            unit={DAI}
            update={setRedeemAmount}
            validate={validate}
            title="Enter the amount you would like to redeem."
          >
            <Box>
              <Text t="subheading">Dai Balance</Text>
              <Text
                t="caption"
                display="inline-block"
                ml="s"
                color="darkLavender"
              >
                {daiBalance && daiBalance.gt(0)
                  ? `${daiBalance.toString(4).split(' ')[0]} DAI`
                  : '--'}
              </Text>
            </Box>
          </AmountInputCard>
          <Grid
            justifySelf="center"
            justifyContent="center"
            gridTemplateColumns="auto auto"
            gridColumnGap="m"
          >
            <Button variant="secondary-outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={!redeemAmount || !valid} onClick={onNext}>
              Continue
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <div />
    </Grid>
  );
}

export default DaiRedeem;
