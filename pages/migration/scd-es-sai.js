import useMaker from '../../hooks/useMaker';
import FlowBackground from '../../components/FlowBackground';
import { Grid, Flex } from '@makerdao/ui-components-core';
import FlowHeader from '../../components/FlowHeader';
import InProgress from '../../components/InProgress';
import FadeInFromSide from '../../components/FadeInFromSide';
import { useState } from 'react';
import { Router } from 'next/router';

/*

Form:
- 

*/

const steps = [
  props => <Form {...props} />,
  props => <InProgress {...props} title="Exchanging Sai for WETH" />
];

export default function() {
  const { account } = useMaker();
  const [currentStep, setCurrentStep] = useState(0);
  const [migrationTxHash, setMigrationTxHash] = useState(null);

  return (
    <FlowBackground>
      <Grid>
        <FlowHeader account={account} />
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
                  onPrev: () => setCurrentStep(s => s - 1),
                  onNext: () => setCurrentStep(s => s + 1),
                  migrationTxHash,
                  setMigrationTxHash
                })}
              </FadeInFromSide>
            );
          })}
        </Flex>
      </Grid>
    </FlowBackground>
  );
}

function Form() {
  return <div>TODO show form</div>
}

