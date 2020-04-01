import React, { useState, useEffect } from 'react';
import { Text, Grid, Card, Button, Box } from '@makerdao/ui-components-core';
import { DAI } from '../../maker';
import AmountInputCard from '../AmountInputCard';
import CollateralTable from './CollateralTable';
import LoadingToggle from '../LoadingToggle';
import useStore from '../../hooks/useStore';
import { addToastWithTimeout } from '../Toast';
import useMaker from '../../hooks/useMaker';
import { prettifyNumber } from '../../utils/ui';

function DaiRedeem({
  onClose,
  setRedeemAmount,
  redeemAmount,
  onNext,
}) {
  const { maker } = useMaker();
  const [{ dsrBalance, daiBalance, bagBalance, endBalance, fixedPrices, tagPrices, outAmounts }, dispatch] = useStore();
  const daiEndBalance = daiBalance.plus(endBalance);
  const [valid, setValid] = useState(true);
  const [dsrWithdrawn, setDsrWithdrawn] = useState(dsrBalance.eq(0));
  const [dsrWithdrawing, setDsrWithdrawing] = useState(false);
  const validate = value => {
    let msg;
    if (value.lte(0)) msg = 'Amount must be greater than 0';
    else if (value.gt(daiEndBalance)) msg = 'Insufficient Dai balance';

    setValid(!msg);
    return msg;
  };

  const withdrawDsr = async () => {
    setDsrWithdrawing(true);
    try {
      await maker.service('mcd:savings').exitAll();
      const newDaiBalance = DAI(await maker.getToken('MDAI').balance());
      dispatch({
        type: 'assign',
        payload: {
          daiBalance: newDaiBalance,
          dsrBalance: DAI(0)
        }
      });
      setDsrWithdrawn(true);
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `withdraw savings Dai tx failed: ${message}`;
      console.error(errMsg);
      addToastWithTimeout(errMsg, dispatch);
    }
    setDsrWithdrawing(false);
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
            <CollateralTable data={fixedPrices} tagData={tagPrices} amount={redeemAmount} daiBalance={daiBalance} bagBalance={bagBalance} outAmounts={outAmounts} />
          </Card>
          {dsrBalance.gt(0) ?
          <Card>
           <LoadingToggle
                  defaultText={`Withdraw ${prettifyNumber(dsrBalance.toBigNumber())} Savings DAI`}
                  loadingText={`Withdrawing ${prettifyNumber(dsrBalance.toBigNumber())} Savings DAI`}
                  completeText={`${prettifyNumber(dsrBalance.toBigNumber())} Savings DAI Withdrawn`}
                  isLoading={dsrWithdrawing}
                  isComplete={dsrWithdrawn}
                  onToggle={withdrawDsr}
                  disabled={dsrWithdrawn}
                  reverse={false}
                />
          </Card>: ''}
          <AmountInputCard
            max={daiEndBalance}
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
                {daiEndBalance && daiEndBalance.gt(0)
                  ? `${prettifyNumber(daiEndBalance.toBigNumber())} DAI`
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
