//////////////////
/// SAI to DAI ///
//////////////////

import React, { useState, useEffect } from 'react';
import { Stepper, Grid, Flex } from '@makerdao/ui-components-core';
import Router from 'next/router';
import FlowBackground from '../../components/FlowBackground';
import FlowHeader from '../../components/FlowHeader';
import useMaker from '../../hooks/useMaker';
import SCDRedeem from '../../components/upgradesai/SCDRedeem';
import Confirmation from '../../components/upgradesai/Confirmation';
import InProgress from '../../components/InProgress';
import Complete from '../../components/upgradesai/Complete';
import Failed from '../../components/Failed';
import FadeInFromSide from '../../components/FadeInFromSide';
import daiLogo from '../../assets/icons/dai-logo.svg';

const steps = [
  props => <SCDRedeem {...props} />,
  props => <Confirmation {...props} />,
  props => (
    <InProgress {...props} title="Your Sai is being upgraded" image={daiLogo} />
  ),
  props => <Complete {...props} />,
  props => (
    <Failed
      {...props}
      title="Upgrade failed"
      subtitle="Your Single-Collateral Sai has not been upgraded to Multi-Collateral Dai."
    />
  )
];

export default function() {
  const { account } = useMaker();
  const [currentStep, setCurrentStep] = useState(0);
  const [migrationTxHash, setMigrationTxHash] = useState(null);

  useEffect(() => {
    if (!account) Router.replace('/');
  }, []); // eslint-disable-line

  const toPrevStepOrClose = () => {
    if (currentStep <= 0) Router.replace('/overview');
    setCurrentStep(s => s - 1);
  };
  const toNextStep = () => setCurrentStep(s => s + 1);
  const reset = () => setCurrentStep(0);
  const showErrorMessageAndAllowExiting = () => setCurrentStep(4);

  return (
    <FlowBackground>
      <Grid gridRowGap={{ s: 's', l: 'xl' }}>
        <FlowHeader account={account} showClose={currentStep <= 1} />
        <Stepper
          steps={['Sai Upgrade', 'Confirmation']}
          selected={currentStep}
          m="0 auto"
          mt={'m'}
          p={['0 80px', '0']}
          opacity={currentStep < 2 ? 1 : 0}
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
                  setMigrationTxHash,
                  migrationTxHash,
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
