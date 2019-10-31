import React, { useState, useEffect } from 'react';
import { Stepper, Grid, Text, Flex } from '@makerdao/ui-components-core';
import Router from 'next/router';
import FlowBackground from '../../components/FlowBackground';
import Account from '../../components/Account';
import FadeInFromSide from '../../components/FadeInFromSide';
import SelectCDP from '../../components/migratecdp/SelectCDP';
import DeployProxy from '../../components/migratecdp/DeployProxy';
import PayAndMigrate from '../../components/migratecdp/PayAndMigrate';
import Migrating from '../../components/migratecdp/Migrating';
import Complete from '../../components/migratecdp/Complete';
import useMaker from '../../hooks/useMaker';

import crossCircle from '../../assets/icons/crossCircle.svg';

const steps = [
  props => <SelectCDP {...props} />,
  props => <DeployProxy {...props} />,
  props => <PayAndMigrate {...props} />,
  props => <Migrating {...props} />,
  props => <Complete {...props} />
];

function MigrateCDP() {
  const { account } = useMaker();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!account) Router.replace('/');
  }, []);

  const toPrevStepOrClose = () => {
    if (currentStep <= 0) Router.replace('/overview');
    setCurrentStep(currentStep - 1);
  };
  const toNextStep = () => setCurrentStep(currentStep + 1);
  const reset = () => setCurrentStep(0);

  return (
    <FlowBackground open={true}>
      <Grid gridRowGap="xl">
        <Grid
          justifyContent="flex-end"
          gridTemplateColumns="auto auto"
          gridColumnGap="m"
          pt="xl"
          px="m"
        >
          {account ? <Account account={account} /> : null}
          <Flex
            alignItems="center"
            onClick={() => Router.replace('/overview')}
            css={{ cursor: 'pointer' }}
          >
            <img src={crossCircle} />
            &nbsp;
            <Text color="steel" fontWeight="medium">
              Close
            </Text>
          </Flex>
        </Grid>
        <Stepper
          steps={['Select CDP', 'Deploy Proxy', 'Pay & Migrate']}
          selected={currentStep}
          m="0 auto"
          opacity={currentStep < 3 ? 1 : 0}
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
                  onReset: reset
                })}
              </FadeInFromSide>
            );
          })}
        </Flex>
      </Grid>
    </FlowBackground>
  );
}

export default MigrateCDP;
