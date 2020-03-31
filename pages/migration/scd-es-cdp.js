/////////////////////////////////
/// SCD Collateral Redemption ///
/////////////////////////////////

import React, { useState, useEffect } from 'react';
import useMaker from '../../hooks/useMaker';
import useStore from '../../hooks/useStore';
import FlowBackground from '../../components/FlowBackground';
import FlowHeader from '../../components/FlowHeader';
import { prettifyNumber } from '../../utils/ui';
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
import CollateralRedeem from '../../components/redeemscdvaults/CollateralRedeem';
import Confirmation from '../../components/redeemscdvaults/Confirmation';
import InProgress from '../../components/InProgress';
import Complete from '../../components/Complete';
import Failed from '../../components/Failed';
import FadeInFromSide from '../../components/FadeInFromSide';
import InProgressImage from '../../assets/icons/daiRedeem.svg';

const CompleteBody = () => {
  const [{ redeemedCollateral }] = useStore();
  const amount = redeemedCollateral
    ? prettifyNumber(redeemedCollateral.toNumber())
    : 0;
  return (
    <Card>
      <Grid gridRowGap="s" color="darkPurple" px={{ s: 'm' }} py={{ s: 'xs' }}>
        <Table p={0}>
          <Table.tbody>
            <Table.tr>
              <Table.td>
                <Text display={'block'}>Total Collateral in CDP</Text>
                <Text t="heading" display={'block'} fontWeight="bold">
                  {`${amount} ETH`}
                </Text>
              </Table.td>
            </Table.tr>
            <Table.tr>
              <Table.td>
                <Text display={'block'}>Exchange Rate (PETH/WETH)</Text>
                <Text t="heading" display={'block'} fontWeight="bold">
                  // Pass in actual exchange rate 1:1
                </Text>
              </Table.td>
            </Table.tr>
            <Table.tr>
              <Table.td>
                <Text display={'block'}>Received Collateral</Text>
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
  props => <CollateralRedeem {...props} />,
  props => <Confirmation {...props} />,
  props => (
    <InProgress
      {...props}
      title="Your ETH is being redeemed"
      image={InProgressImage}
    />
  ),
  props => (
    <Complete
      {...props}
      title="Redemption Complete"
      description="You've successfully redeemed the collateral from your SCD vault."
    >
      <CompleteBody />
    </Complete>
  ),
  props => (
    <Failed
      {...props}
      title="Redemption Failed"
      subtitle="Your collateral in the Single Collateral Dai vault was not redeemed"
    />
  )
];

async function getCdpData(cdp) {
  const debtValueExact = await cdp.getDebtValue();
  const debtValue = prettifyNumber(debtValueExact.toString());
  const collateralValueExact = await cdp.getCollateralValue(USD);
  const govFeeMKRExact = await cdp.getGovernanceFee();
  const govFeeMKR =
    govFeeMKRExact.toNumber() > 0.01
      ? prettifyNumber(govFeeMKRExact, false, 2, false)
      : round(govFeeMKRExact.toNumber(), 6);

  const govFeeDaiExact = await cdp.getGovernanceFee(USD);
  const govFeeDai =
    govFeeDaiExact.toNumber() > 0.01
      ? prettifyNumber(govFeeDaiExact, false, 2, false)
      : round(govFeeDaiExact.toNumber(), 4);

  const collateralizationRatioExact =
    (await cdp.getCollateralizationRatio()) * 100;

  const collateralizationRatio =
    collateralizationRatioExact === Infinity
      ? '---'
      : prettifyNumber(collateralizationRatioExact);

  return {
    collateralValueExact,
    collateralizationRatio,
    debtValueExact,
    govFeeDaiExact,
    debtValue,
    govFeeDai,
    govFeeMKR,
    govFeeMKRExact
  };
}

async function getAllCdpData(allCdps, maker) {
  const cdpIds = Object.values(allCdps).flat();
  const allCdpData = await Promise.all(
    cdpIds.map(async id => {
      const cdp = await maker.getCdp(id);
      const data = await getCdpData(cdp);
      return { ...cdp, ...data, give: cdp.give };
    })
  );
  return allCdpData.sort(
    (a, b) => b.debtValueExact.toNumber() - a.debtValueExact.toNumber()
  );
}

export default function() {
  const { account } = useMaker();
  const [currentStep, setCurrentStep] = useState(0);
  const [txHash, setTxHash] = useState(null);

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
    // TODO list total PETH in your CDPs, PETH:WETH ratio
    <FlowBackground>
      <Grid gridRowGap={{ s: 's', l: 'xl' }}>
        <FlowHeader account={account} showClose={currentStep <= 1} />
        <Stepper
          steps={['Collateral Redemption', 'Confirmation']}
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
                  setTxHash,
                  txHash,
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
