import React, { useState, useEffect } from 'react';
import { Text, Grid, Card, Button, Box, Flex, Checkbox, Link } from '@makerdao/ui-components-core';
import { DAI } from '../../maker';
import AmountInputCard from '../AmountInputCard';
import useStore from '../../hooks/useStore';
import { addToastWithTimeout } from '../Toast';
import useMaker from '../../hooks/useMaker';
import { prettifyNumber } from '../../utils/ui';
import useProxy from '../../hooks/useProxy';

function DepositDai({
  onClose,
  setRedeemAmount,
  redeemAmount,
  onNext,
}) {
  const { maker } = useMaker();
  const [{ dsrBalance, daiBalance, endBalance}, dispatch] = useStore();
  const daiEndBalance = daiBalance.plus(endBalance);
  const [valid, setValid] = useState(true);
  const [dsrWithdrawn, setDsrWithdrawn] = useState(dsrBalance.eq(0));
  const [dsrWithdrawing, setDsrWithdrawing] = useState(false);
  const [hasReadTOS, setHasReadTOS] = useState(false);
  const { proxyAddress } = useProxy();
  const [hasDeposit, setHasDeposit] = useState(endBalance.gte(redeemAmount));
  const [depositLoading, setDepositLoading] = useState(false);

  useEffect(() => {
    setHasDeposit(endBalance.gte(redeemAmount));
  }, [endBalance, redeemAmount]);

  const packDai = async () => {
    try {
      setDepositLoading(true);
      const mig = maker
        .service('migration')
        .getMigration('global-settlement-dai-redeemer');
      const packAmount = redeemAmount.minus(endBalance);
      if (packAmount.gt(0)) {
        await mig.packDai(packAmount);
        const newBagBalance = await maker
        .service('migration')
        .getMigration('global-settlement-dai-redeemer')
        .bagAmount(proxyAddress);
        dispatch({
          type: 'assign',
          payload: {
            daiBalance: newBagBalance
          }
        });
      }
      onNext();
      setHasDeposit(true);
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `pack dai tx failed ${message}`;
      console.error(errMsg);
      addToastWithTimeout(errMsg, dispatch);
    }
    setDepositLoading(false);
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

  const validate = value => {
    let msg;
    if (value.lte(0)) msg = 'Amount must be greater than 0';
    else if (value.gt(daiEndBalance)) msg = 'Insufficient Dai balance';

    setValid(!msg);
    return msg;
  };

  return (
    <Grid maxWidth="912px" gridRowGap="m" px={['s', 0]}>
      <Text.h2 textAlign="center">Deposit Dai to Redeem</Text.h2>
      <Text.p textAlign="center" t="body" fontSize="1.8rem" m="0 auto">
        Deposit your Dai to redeem it for collateral from the system.
      </Text.p>
      <Grid gridTemplateColumns="1fr 1fr 1fr">
        <div />
        <Grid width="567px" gridRowGap="l">
          {dsrBalance.gt(0) ?
          <Card
            bg="yellow.100"
            color="#826318"
            borderColor="yellow.400"
            border="1px solid"
            lineHeight="normal"
            p="s"
          >
            <Flex>
              <div>
                {'You have '}<b>{`${prettifyNumber(dsrBalance.toBigNumber())} DAI`}</b>{' in the DSR. Would you like to withdraw this Dai to your wallet?'}
              </div>
            <Button
              variant="secondary-outline"
              style={{backgroundColor: 'white'}}
              ml='l'
              my='7px'
              px="12px"
              py="4px"
              width="89px"
              justifySelf="center"
              fontSize={'13px'}
              onClick={withdrawDsr}
              disabled={dsrWithdrawn}
              loading={dsrWithdrawing}
            >
              Withdraw
            </Button>
            </Flex>
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
                {daiBalance && daiBalance.gt(0)
                  ? `${prettifyNumber(daiBalance.toBigNumber())} DAI`
                  : '--'}
              </Text>
            </Box>
            <Box>
              <Text t="subheading">Dai Deposited</Text>
              <Text
                t="caption"
                display="inline-block"
                ml="s"
                color="darkLavender"
              >
                {endBalance && endBalance.gt(0)
                  ? `${prettifyNumber(endBalance.toBigNumber())} DAI`
                  : '--'}
              </Text>
            </Box>
          </AmountInputCard>
          <Card
            px={'m'}
            py={'m'}>
                <Checkbox
                  mr="s"
                  fontSize="l"
                  checked={hasReadTOS}
                  onChange={() => setHasReadTOS(!hasReadTOS)}
                />
                <Text
                  t="caption"
                  color="steel"
                  data-testid="terms"
                  onClick={() => setHasReadTOS(!hasReadTOS)}
                >
                  I have read and accept the{' '}
                  <Link target="_blank" href="/terms">
                    Terms of Service
                  </Link>
                  .
                </Text>
            </Card>
            <Grid
                justifySelf="center"
                justifyContent="center"
                gridTemplateColumns="auto auto"
                gridColumnGap="m"
            >
            <Button variant="secondary-outline" onClick={onClose}>
              Back
            </Button>
            {hasDeposit ? (
              <Button disabled={redeemAmount.eq(0) || !valid || !hasReadTOS} onClick={onNext} width="130px">
              Continue
            </Button>
            ) :
            (<Button disabled={redeemAmount.eq(0) || !valid || !hasReadTOS} onClick={packDai} loading={depositLoading} width="130px">
              Deposit
            </Button>)}
          </Grid>
        </Grid>
      </Grid>
      <div />
    </Grid>
  );
}

export default DepositDai;
