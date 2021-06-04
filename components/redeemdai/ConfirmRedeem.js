import React, { useState } from 'react';
import { Grid, Text, Button } from '@makerdao/ui-components-core';
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
      await mig.cash(amount,ilk);
      setRedeemComplete(redeemComplete => [...redeemComplete, ilk]);
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `cash tx failed ${message}`;
      console.error(errMsg);
      addToastWithTimeout(errMsg, dispatch);
      setRedeemInitiated(redeemInitiated => redeemInitiated.filter(i => i !== ilk));
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
