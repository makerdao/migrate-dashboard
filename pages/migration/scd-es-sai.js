//////////////////////
/// Sai Redemption ///
//////////////////////

import React, { useState, useEffect } from 'react';
import useMaker from '../../hooks/useMaker';
import useStore from '../../hooks/useStore';
import { prettifyNumber } from '../../utils/ui';
import FlowBackground from '../../components/FlowBackground';
import FlowHeader from '../../components/FlowHeader';
import {
  Stepper,
  Grid,
  Flex,
  Card,
  Table,
  Text
} from '@makerdao/ui-components-core';
import Router from 'next/router';
// To add
import SaiRedeem from '../../components/redeemsai/SaiRedeem';
import InProgress from '../../components/InProgress';
import Complete from '../../components/Complete';
import Failed from '../../components/Failed';
import FadeInFromSide from '../../components/FadeInFromSide';
import InProgressImage from '../../assets/icons/daiRedeem.svg';

const CompleteBody = () => {
  const [{ saiAmountToRedeem }] = useStore();
  const amount = saiAmountToRedeem
    ? prettifyNumber(saiAmountToRedeem.toNumber())
    : 0;
  return (
    <Card>
      <Grid gridRowGap="s" color="darkPurple" px={{ s: 'm' }} py={{ s: 'xs' }}>
        <Table p={0}>
          <Table.tbody>
            <Table.tr>
              <Table.td>
                <Text display={'block'}>Sent: Sai</Text>
                <Text t="heading" display={'block'} fontWeight="bold">
                  {`${amount} SAI`}
                </Text>
              </Table.td>
            </Table.tr>
            <Table.tr>
              <Table.td>
                <Text display={'block'}>Exchange Rate</Text>
                <Text t="heading" display={'block'} fontWeight="bold">
                  // Pass in actual exchange rate 1:1
                </Text>
              </Table.td>
            </Table.tr>
            <Table.tr>
              <Table.td>
                <Text display={'block'}>Received: ETH</Text>
                <Text t="heading" display={'block'} fontWeight="bold">
                  {`${amount} ETH`}
                </Text>
              </Table.td>
            </Table.tr>
          </Table.tbody>
        </Table>
      </Grid>
    </Card>
  );
};

const steps = [
  props => <SaiRedeem {...props} />,
  props => (
    <InProgress
      {...props}
      title="Your SAI is being redeemed"
      image={InProgressImage}
    />
  ),
  props => (
    <Complete
      {...props}
      title="Redemption Complete"
      description="You've successfully redeemed your Sai for ETH."
    >
      <CompleteBody />
    </Complete>
  ),
  props => (
    <Failed
      {...props}
      title="Redemption failed"
      subtitle="Your Sai was not redeemed"
    />
  )
];

export default function() {
  const { account, maker } = useMaker();
  const [currentStep, setCurrentStep] = useState(0);
  const [txHash, setTxHash] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    if (!account) Router.replace('/');
  }, []); // eslint-disable-line

  useEffect(() => {
    (async () => {
      if (maker) {
        const xRate = await maker
          .service('migration')
          .getMigration('redeem-sai')
          .getRate();
        setExchangeRate(xRate);
      }
    })();
  }, [maker]);

  const toPrevStepOrClose = () => {
    if (currentStep <= 0) Router.replace('/overview');
    setCurrentStep(s => s - 1);
  };
  const toNextStep = () => setCurrentStep(s => s + 1);
  const reset = () => setCurrentStep(0);
  const showErrorMessageAndAllowExiting = () => setCurrentStep(3);

  return (
    <FlowBackground>
      <Grid gridRowGap={{ s: 's', l: 'xl' }}>
        <FlowHeader account={account} showClose={currentStep <= 1} />
        <Flex position="relative" justifyContent="center" mt="xl">
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
                  setTxHash,
                  txHash,
                  showErrorMessageAndAllowExiting,
                  exchangeRate
                })}
              </FadeInFromSide>
            );
          })}
        </Flex>
      </Grid>
    </FlowBackground>
  );
}
