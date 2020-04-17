import React, { useState } from 'react';
import { Card, Grid, Text, Button } from '@makerdao/ui-components-core';
import CollateralTable from './CollateralTable';
import { addToastWithTimeout } from '../Toast';
import useMaker from '../../hooks/useMaker';
import useStore from '../../hooks/useStore';

function ConfirmRedeem({ redeemAmount, onClose }) {
  const { maker } = useMaker();
  const [
    { fixedPrices, tagPrices, bagBalance, outAmounts },
    dispatch
  ] = useStore();
  const [redeemInitiated, setRedeemInitiated] = useState([]);
  const [redeemComplete, setRedeemComplete] = useState([]);

  const redeemDai = async (amount, ilk) => {
    try {
      setRedeemInitiated(redeemInitiated => [...redeemInitiated, ilk]);
      const mig = maker
        .service('migration')
        .getMigration('global-settlement-dai-redeemer');
      if (ilk === 'ETH-A') await mig.cashEth(amount);
      if (ilk === 'BAT-A') await mig.cashBat(amount);
      if (ilk === 'USDC-A') await mig.cashUsdc(amount);
      setRedeemComplete(redeemComplete => [...redeemComplete, ilk]);
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `cash tx failed ${message}`;
      console.error(errMsg);
      addToastWithTimeout(errMsg, dispatch);
    }
  };

  return (
    <Grid maxWidth="912px" gridRowGap="m" px={['s', 0]}>
      <Text.h2 textAlign="center">Redeem Dai</Text.h2>
      <Grid gridRowGap="xs">
        <Text.p fontSize="1.7rem" color="darkLavender" textAlign="center">
          Redeem your Dai for a proportional amount of underlying collateral
          from the Multi-Collateral Dai system.
        </Text.p>
      </Grid>
      <Grid gridTemplateColumns="1fr 1fr 1fr">
        <div />
        <Grid gridRowGap="s">
          <Card p="m" borderColor="#D4D9E1" border="1px solid" width="760px">
            <CollateralTable
              data={fixedPrices}
              tagData={tagPrices}
              amount={redeemAmount}
              redeemDai={redeemDai}
              bagBalance={bagBalance}
              outAmounts={outAmounts}
              redeemComplete={redeemComplete}
              buttonLoading={redeemInitiated}
            />
          </Card>
        </Grid>
      </Grid>
      <div />
      <Grid
        justifySelf="center"
        justifyContent="center"
        gridTemplateColumns="auto auto"
        gridColumnGap="m"
      >
        <Button variant="secondary-outline" onClick={onClose}>
          Exit
        </Button>
      </Grid>
    </Grid>
  );
}

export default ConfirmRedeem;
