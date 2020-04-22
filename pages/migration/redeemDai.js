import React, { useState, useEffect } from 'react';
import { Stepper, Grid, Flex } from '@makerdao/ui-components-core';
import Router from 'next/router';
import FlowBackground from '../../components/FlowBackground';
import FlowHeader from '../../components/FlowHeader';
import useMaker from '../../hooks/useMaker';
import Failed from '../../components/Failed';
import FadeInFromSide from '../../components/FadeInFromSide';
import DepositDai from '../../components/redeemdai/DepositDai';
import DeployProxy from '../../components/redeemdai/DeployProxy';
import ConfirmRedeem from '../../components/redeemdai/ConfirmRedeem';
import { DAI } from '../../maker';

const steps = [
  props => <DeployProxy {...props} />,
  props => <DepositDai {...props} />,
  props => <ConfirmRedeem {...props} />
];

export default function () {
  const { account } = useMaker();
  const [currentStep, setCurrentStep] = useState(0);
  const [redeemTxHash, setRedeemTxHash] = useState(null);
  const [redeemAmount, setRedeemAmount] = useState(DAI(0));

  useEffect(() => {
    if (!account) Router.replace('/');
  }, []); // eslint-disable-line

  const toPrevStepOrClose = () => {
    if (currentStep <= 0) Router.replace('/overview');
    setCurrentStep(s => s - 1);
  };
  const toNextStep = () => setCurrentStep(s => s + 1);
  const reset = () => setCurrentStep(0);

  if (!account) return null;

  return (
    <FlowBackground>
      <Grid gridRowGap={{ s: 's', l: 'xl' }}>
        <FlowHeader account={account} showClose={true} />
        <Stepper
          steps={['Set Up Proxy', 'Deposit Dai', 'Redeem']}
          selected={currentStep}
          m="0 auto"
          mt={'m'}
          p={['0 80px', '0']}
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
                  onPrev: toPrevStepOrClose,
                  onNext: toNextStep,
                  onReset: reset,
                  setRedeemTxHash,
                  redeemTxHash,
                  setRedeemAmount,
                  redeemAmount
                })}
              </FadeInFromSide>
            );
          })}
        </Flex>
      </Grid>
    </FlowBackground>
  );
}
