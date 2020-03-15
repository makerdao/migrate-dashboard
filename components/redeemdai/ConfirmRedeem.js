import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
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

function ConfirmRedeem({
  onPrev,
  redeemAmount,
  setRedeemTxHash,
  onNext,
  dispatch,
  collateralData
}) {
  const { maker, account } = useMaker();
  const [hasReadTOS, setHasReadTOS] = useState(false);
  const [redeemInitiated, setRedeemInitiated] = useState(false);

  const {
    proxyAddress,
    proxyLoading,
    setupProxy,
    initialProxyCheck,
    startedWithoutProxy,
    hasProxy
  } = useProxy();

  console.log(proxyAddress);
  const [hasAllowance, setHasAllowance] = useState(false);
  const [allowanceLoading, setAllowanceLoading] = useState(false);

  const redeemCollateral = async () => {
    try {
      setRedeemInitiated(true);

      const mockHash =
        '0x5179b053b1f0f810ba7a14f82562b389f06db4be6114ac6c40b2744dcf272d95';
      setRedeemTxHash(mockHash);
      onNext();
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `redeem vaults tx failed ${message}`;
      console.error(errMsg);
      addToastWithTimeout(errMsg, dispatch);
    }
  };

  const showProxy =
    !initialProxyCheck && (startedWithoutProxy || proxyLoading || !hasProxy);

  const giveProxyDaiAllowance = async () => {
    setAllowanceLoading(true);
    try {
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
      <Text.h2 textAlign="center">Confirm Transaction</Text.h2>
      <Grid gridTemplateColumns="1fr 1fr 1fr">
        <div />
        <Card p="m" borderColor="#D4D9E1" border="1px solid">
          <Grid gridRowGap="s" width="567px">
            <CollateralTable data={collateralData} />
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
                disabled={!hasProxy || hasAllowance}
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
        <div />
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
          disabled={
            redeemInitiated || !hasReadTOS || !hasProxy || !hasAllowance
          }
          onClick={redeemCollateral}
        >
          Convert Dai
        </Button>
      </Grid>
    </Grid>
  );
}

export default ConfirmRedeem;
