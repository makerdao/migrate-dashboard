import React, { useState, useEffect } from 'react';
import { Stepper, Grid, Flex } from '@makerdao/ui-components-core';
import Router from 'next/router';
import FlowBackground from '../../components/FlowBackground';
import FlowHeader from '../../components/FlowHeader';
import FadeInFromSide from '../../components/FadeInFromSide';
import RedeemVaults from '../../components/redeemvaults/RedeemVaults';
import useMaker from '../../hooks/useMaker';
import useStore from '../../hooks/useStore';

const steps = [props => <RedeemVaults {...props} />];

export default function () {
  const { account } = useMaker();
  const [redeemTxHash, setRedeemTxHash] = useState(null);
  const [redeemTxObject, setRedeemTxObject] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!account) Router.replace('/');
  }, [account]);

  const [{ vaultsToRedeem }] = useStore();

  const onPrev = () => {
    if (currentStep <= 0) Router.replace('/overview');
    setCurrentStep(step => step - 1);
  };

  const onNext = () => setCurrentStep(step => step + 1);
  const onReset = () => setCurrentStep(0);
  const showErrorMessageAndAllowExiting = () => setCurrentStep(5);

  return (
    <FlowBackground>
      <Grid gridRowGap={['m', 'xl']}>
        <FlowHeader account={account} showClose={currentStep <= 2} />
        <Stepper
          steps={['Select Vaults']}
          selected={currentStep}
          mt={{ s: '10px' }}
          m="0 auto"
          p={['0 80px', '0']}
          opacity={0}
          transition="opacity 0.2s"
        />
        <Flex position="relative" justifyContent="center">
          {steps.map((step, index) => {
            return (
              <FadeInFromSide
                key={index}
                active={currentStep === index}
                toLeft={index < currentStep}
                toRight={index > currentStep}
              >
                {step({
                  onClose: () => Router.replace('/overview'),
                  onPrev,
                  onNext,
                  onReset,
                  vaultsToRedeem,
                  redeemTxObject,
                  setRedeemTxObject,
                  setRedeemTxHash,
                  redeemTxHash,
                  migrationTxHash: redeemTxHash,
                  showErrorMessageAndAllowExiting
                })}
              </FadeInFromSide>
            );
          })}
        </Flex>
      </Grid>
    </FlowBackground>
  );
}
