import React, { useState, use } from 'react';
import {
  Stepper,
  Grid,
  Text,
  Flex,
  Box,
  Button
} from '@makerdao/ui-components-core';
import FlowBackground from './FlowBackground';
import Account from '../Account';
import FadeInFromSide from '../FadeInFromSide';
import SelectCDP from './migratecdp/SelectCDP';
import DeployProxy from './migratecdp/DeployProxy';
import PayAndMigrate from './migratecdp/PayAndMigrate';
import Migrating from './migratecdp/Migrating';
import Complete from './migratecdp/Complete';

import crossCircle from '../../assets/icons/crossCircle.svg';

const steps = [
  props => <SelectCDP {...props} />,
  props => <DeployProxy {...props} />,
  props => <PayAndMigrate {...props} />,
  props => <Migrating {...props} />,
  props => <Complete {...props} />
];

function MigrateCDP({ open, onClose, account }) {
  const [currentStep, setCurrentStep] = useState(0);

  const toPrevStepOrClose = () => {
    if (currentStep <= 0) return onClose();
    setCurrentStep(currentStep - 1);
  };
  const toNextStep = () => setCurrentStep(currentStep + 1);
  const reset = () => setCurrentStep(0);

  return (
    <FlowBackground open={open}>
      <Grid gridRowGap="xl">
        <Grid
          justifyContent="flex-end"
          gridTemplateColumns="auto auto"
          gridColumnGap="m"
          pt="xl"
          px="m"
        >
          <Account account={account} />
          <Flex
            alignItems="center"
            onClick={onClose}
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
                active={currentStep === index}
                toLeft={index < currentStep}
                toRight={index > currentStep}
              >
                {step({
                  onClose,
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
