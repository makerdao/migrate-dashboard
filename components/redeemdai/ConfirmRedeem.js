import React, { useState } from 'react';
import {
  Card,
  Grid,
  Flex,
  Text,
  Button
} from '@makerdao/ui-components-core';
import CollateralTable from './CollateralTable';
import { addToastWithTimeout } from '../Toast';
import useMaker from '../../hooks/useMaker';
import useStore from '../../hooks/useStore';

function ConfirmRedeem({
  onPrev,
  redeemAmount,
  onClose
}) {
  const { maker } = useMaker();
  const [{ fixedPrices, tagPrices, bagBalance, outAmounts }, dispatch] = useStore();
  const [redeemInitiated, setRedeemInitiated] = useState(false);
  const [redeemComplete, setRedeemComplete] = useState([]);


  const redeemDai = async (amount, ilk) => {

    try {
      setRedeemInitiated(ilk);
      const mig = maker
        .service('migration')
        .getMigration('global-settlement-dai-redeemer');
      if(ilk==='ETH-A') await mig.cashEth(amount);
      if(ilk==='BAT-A') await mig.cashBat(amount);
      if(ilk==='USDC-A') await mig.cashUsdc(amount);
      setRedeemComplete([...redeemComplete, ilk]);
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `cash tx failed ${message}`;
      console.error(errMsg);
      addToastWithTimeout(errMsg, dispatch);
    }
    setRedeemInitiated(false);
  };

  return (
    <Grid maxWidth="912px" gridRowGap="m" px={['s', 0]}>
      <Text.h2 textAlign="center">Redeem Dai</Text.h2>
      <Grid gridTemplateColumns="1fr 1fr 1fr">
        <div />
        <Grid gridRowGap="s">
          <Card p="m" borderColor="#D4D9E1" border="1px solid">
            <Grid gridRowGap="s" width="567px">
              <CollateralTable data={fixedPrices} tagData={tagPrices} amount={redeemAmount} redeemDai={redeemDai}
              bagBalance={bagBalance} outAmounts={outAmounts}
              redeemComplete={redeemComplete}
              buttonLoading={redeemInitiated}/>
            </Grid>
          </Card>

          <Card py="m" px="l">
            <Flex justifyContent="space-between">
              <Text.p>Redeeming</Text.p>
              <Text.p>{redeemAmount.toString(4).split(' ')[0]} DAI</Text.p>
            </Flex>
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
        <Button variant="secondary-outline" onClick={onPrev}>
          Back
        </Button>
        <Button variant="secondary-outline" onClick={onClose}
        >
          Close
        </Button>
      </Grid>
    </Grid>
  );
}

export default ConfirmRedeem;
