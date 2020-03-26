import React, { useState, useEffect } from 'react';
import {
  Card,
  Grid,
  Flex,
  Text,
  Button,
  Checkbox,
  Link
} from '@makerdao/ui-components-core';
import CollateralTable from './CollateralTable';
import { addToastWithTimeout } from '../Toast';
import useProxy from '../../hooks/useProxy';
import LoadingToggle from '../LoadingToggle';
import useMaker from '../../hooks/useMaker';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import useStore from '../../hooks/useStore';

function ConfirmRedeem({
  onPrev,
  redeemAmount,
  onNext,
  dispatch
}) {
  const { maker, account } = useMaker();
  const [{ fixedPrices, bagBalance }] = useStore();
  const [hasReadTOS, setHasReadTOS] = useState(false);
  const [redeemInitiated, setRedeemInitiated] = useState(false);
  const [redeemComplete, setRedeemComplete] = useState([]);
  const {
    proxyAddress,
    proxyLoading,
    setupProxy,
    initialProxyCheck,
    startedWithoutProxy,
    hasProxy
  } = useProxy();
  console.log('bagBalance', bagBalance.toString());
  const [hasAllowance, setHasAllowance] = useState(false);
  const [allowanceLoading, setAllowanceLoading] = useState(false);

  const [hasDeposit, setHasDeposit] = useState(bagBalance >= redeemAmount);
  const [depositLoading, setDepositLoading] = useState(false);

  const showProxy =
    !initialProxyCheck && (startedWithoutProxy || proxyLoading || !hasProxy);

  const giveProxyDaiAllowance = async () => {
    setAllowanceLoading(true);
    try {
      if (!proxyAddress) {
        throw new Error('No Proxy');
      }
      await maker.getToken(MDAI).approveUnlimited(proxyAddress);
      setHasAllowance(true);
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `unlock dai tx failed ${message}`;
      console.error(errMsg);
      addToastWithTimeout(errMsg, dispatch);
    }
    setAllowanceLoading(false);
  };

  const packDai = async () => {
    try {
      setDepositLoading();
      const mig = maker
        .service('migration')
        .getMigration('global-settlement-dai-redeemer');
      const packAmount = redeemAmount.minus(bagBalance);
      if (packAmount.gt(0)) await mig.packDai(redeemAmount);
      setHasDeposit(true);
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `pack dai tx failed ${message}`;
      console.error(errMsg);
      addToastWithTimeout(errMsg, dispatch);
    }
    setDepositLoading(false);
  };

  const redeemDai = async (ilk) => {
    try {
      setRedeemInitiated(ilk);
      const mig = maker
        .service('migration')
        .getMigration('global-settlement-dai-redeemer');
      if(ilk==='ETH-A') await mig.cashEth(redeemAmount);
      if(ilk==='BAT-A') await mig.cashBat(redeemAmount);
      if(ilk==='USDC-A') await mig.cashUsdc(redeemAmount);
      setRedeemComplete([...redeemComplete, ilk]);
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `cash tx failed ${message}`;
      console.error(errMsg);
      addToastWithTimeout(errMsg, dispatch);
    }
    setRedeemInitiated(false);
  };

  useEffect(() => {
    (async () => {
      if (!maker || !account) return;
      maker
        .service('proxy')
        .currentProxy()
        .then(async address => {
          if (!address) return;
          const connectedWalletAllowance = await maker
            .getToken(MDAI)
            .allowance(account.address, address);
          const hasDaiAllowance = connectedWalletAllowance.gt(0);
          setHasAllowance(hasDaiAllowance);
        });
    })();
  }, [account, maker, hasProxy]);

  return (
    <Grid maxWidth="912px" gridRowGap="m" px={['s', 0]}>
      <Text.h2 textAlign="center">Redeem Dai</Text.h2>
      <Grid gridTemplateColumns="1fr 1fr 1fr">
        <div />
        <Grid gridRowGap="s">
          <Card p="m" borderColor="#D4D9E1" border="1px solid">
            <Grid gridRowGap="s" width="567px">
              <CollateralTable data={fixedPrices} amount={redeemAmount} redeemDai={redeemDai}
              buttonDisabled={!hasAllowance || !hasReadTOS || !hasDeposit} redeemComplete={redeemComplete}
              buttonLoading={redeemInitiated}/>
              <Grid gridRowGap="s" px="s" width="300px">
                {showProxy && (
                  <LoadingToggle
                    defaultText={'Create Proxy'}
                    loadingText={'Creating proxy'}
                    completeText={'Proxy Created'}
                    isLoading={proxyLoading}
                    isComplete={!!hasProxy}
                    onToggle={setupProxy}
                    disabled={!!hasProxy}
                    reverse={false}
                  />
                )}
                <LoadingToggle
                  defaultText={'Unlock DAI'}
                  loadingText={'Unlocking DAI'}
                  completeText={'DAI Unlocked'}
                  isLoading={allowanceLoading}
                  isComplete={hasAllowance}
                  onToggle={giveProxyDaiAllowance}
                  disabled={hasAllowance}
                  reverse={false}
                />
                <LoadingToggle
                  defaultText={'Deposit DAI'}
                  loadingText={'Depositing DAI'}
                  completeText={'DAI Deposited'}
                  isLoading={depositLoading}
                  isComplete={hasDeposit}
                  disabled={hasDeposit}
                  onToggle={packDai}
                  reverse={false}
                />
              </Grid>
              <Grid
                alignItems="center"
                gridTemplateColumns="auto 1fr"
                px={'m'}
                py={'m'}
              >
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
              </Grid>
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
        <Button
          onClick={onNext}
        >
          Close
        </Button>
      </Grid>
    </Grid>
  );
}

export default ConfirmRedeem;
