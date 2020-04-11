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
import useStore from '../../hooks/useStore';
import { DAI } from '../../maker';

const steps = [
  props => <DeployProxy {...props}/>,
  props => <DepositDai {...props} />,
  props => <ConfirmRedeem {...props} />,
  props => (
    <Failed
      {...props}
      title="Redeem failed"
      subtitle={'There was an error with redeeming collateral.'}
    />
  )
];
async function getCollateralData() {
  const dummyData = [
    { token: 'ETH', value: 195.1432, rate: 0.0338, amount: 54.19 },
    { token: 'OMG', value: 5.1432, rate: 4.2198, amount: 1532.41 },
    { token: 'BAT', value: 15.1932, rate: 0.9438, amount: 21211.21 }
  ];

  return new Promise(resolve => setTimeout(resolve(dummyData), 3000));
}

export default function() {
  const { account } = useMaker();
  const [currentStep, setCurrentStep] = useState(0);
  const [redeemTxHash, setRedeemTxHash] = useState(null);
  const [redeemAmount, setRedeemAmount] = useState(DAI(0));
  const [collateralData, setCollateralData] = useState([]);
  const [{ proxyAddress }] = useStore();

  useEffect(() => {
    if (!account) Router.replace('/');
  }, []); // eslint-disable-line

  const toPrevStepOrClose = () => {
    if (currentStep <= 0) Router.replace('/overview');
    setCurrentStep(s => s===2 && proxyAddress ? s - 2 : s - 1);
  };
  const toNextStep = () => setCurrentStep(s => s + 1);
  const reset = () => setCurrentStep(0);
  const showErrorMessageAndAllowExiting = () => setCurrentStep(4);

  useEffect(() => {
    (async () => {
      const data = await getCollateralData();
      setCollateralData(data);
    })();
  }, [account]);

  if (!account) return null;

  return (
    <FlowBackground>
      <Grid gridRowGap={{ s: 's', l: 'xl' }}>
        <FlowHeader account={account} showClose={currentStep <= 1} />
        <Stepper
          steps={['Set Up Proxy', 'Deposit Dai', 'Redeem']}
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
                  setRedeemTxHash,
                  redeemTxHash,
                  showErrorMessageAndAllowExiting,
                  setRedeemAmount,
                  redeemAmount,
                  collateralData
                })}
              </FadeInFromSide>
            );
          })}
        </Flex>
      </Grid>
    </FlowBackground>
  );
}
