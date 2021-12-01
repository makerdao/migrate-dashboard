/////////////////////////////////
/// SCD Collateral Redemption ///
/////////////////////////////////

import React, { useState, useEffect, useReducer } from 'react';
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
import CollateralRedeem from '../../components/redeemscdvaults/CollateralRedeem';
import Confirmation from '../../components/redeemscdvaults/Confirmation';
import InProgress from '../../components/InProgress';
import Complete from '../../components/Complete';
import Failed from '../../components/Failed';
import FadeInFromSide from '../../components/FadeInFromSide';
import InProgressImage from '../../assets/icons/daiRedeem.svg';
import BigNumber from 'bignumber.js';
import { ETH, PETH } from '../../maker';
import assert from 'assert';

const CompleteBody = () => {
  const [{ redeemedCollateral, pethEthRatio }] = useStore();
  const amount = redeemedCollateral
    ? prettifyNumber(redeemedCollateral, false, 3)
    : 0;
  const ratio =
    pethEthRatio && redeemedCollateral
      ? prettifyNumber(pethEthRatio, false, 3)
      : 1;
  const ethVal =
    pethEthRatio && redeemedCollateral
      ? prettifyNumber(
          ETH(redeemedCollateral).times(pethEthRatio).toNumber(),
          false,
          3
        )
      : 0;

  return (
    <Card>
      <Grid gridRowGap="s" color="darkPurple" px={{ s: 'm' }} py={{ s: 'xs' }}>
        <Table p={0}>
          <Table.tbody>
            <Table.tr>
              <Table.td>
                <Text display={'block'}>Total Collateral in CDPs</Text>
                <Text t="heading" display={'block'} fontWeight="bold">
                  {`${amount} PETH`}
                </Text>
              </Table.td>
            </Table.tr>
            <Table.tr>
              <Table.td>
                <Text display={'block'}>Exchange Rate (PETH/WETH)</Text>
                <Text t="heading" display={'block'} fontWeight="bold">
                  {`1 PETH : ${ratio} ETH`}
                </Text>
              </Table.td>
            </Table.tr>
            <Table.tr>
              <Table.td>
                <Text display={'block'}>Received Collateral</Text>
                <Text
                  t="heading"
                  display="block"
                  fontWeight="bold"
                  data-testid="received-collateral"
                >
                  {ethVal} ETH
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
      title="Your collateral is being redeemed"
      image={InProgressImage}
    />
  ),
  props => (
    <Complete
      {...props}
      title="Redemption Complete"
      description={`You've successfully redeemed the collateral from your CDP${
        props.selectedCdps.length > 1 ? 's' : ''
      }.`}
    >
      <CompleteBody />
    </Complete>
  ),
  props => (
    <Failed
      {...props}
      title="Redemption Failed"
      subtitle="Your collateral was not redeemed."
    />
  )
];

const reducer = (state, { type, id, payload, maker, recur }) => {
  if (type === 'replace') {
    return state.filter(([ id ]) => id !== payload[0]).concat([payload]);
  }

  if (type === 'bite') {
    assert(maker, 'missing maker prop in action');
    assert(recur, 'missing recur prop in action');
    (async () => {
      const service = maker.service('cdp');
      const payload = [
        id,
        PETH(await service.getCollateralValue(id, PETH)),
        await service.getDebtValue(id)
      ];

      // this is a kinda-hacky way of handling async in a reducer,
      // by calling itself again after awaiting
      recur({ type: 'replace', payload });
    })();
  } 
  
  return state;
}

export default function () {
  const { maker, account } = useMaker();
  const [currentStep, setCurrentStep] = useState(0);
  const [txCount, setTxCount] = useState();
  const [txHashes, setTxHashes] = useState();
  const [selectedCdps, setSelectedCdps] = useState([]);
  const [ratio, setRatio] = useState();
  const [{ redeemableCdps }] = useStore();
  const [cdps, updateCdps] = useReducer(reducer, redeemableCdps);

  useEffect(() => {
    if (!maker) return;
    (async () => {
      // can't use PriceService.getWethToPethRatio because it loses precision
      const per = await maker
        .service('smartContract')
        .getContract('SAI_TUB')
        .per();
      setRatio(BigNumber(per._hex).div('1e27'));
    })();
  }, [maker]);

  if (!maker) return null;

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
          steps={['Select CDPs', 'Confirm']}
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
                  setTxCount,
                  txCount,
                  setTxHashes,
                  txHashes,
                  showErrorMessageAndAllowExiting,
                  cdps,
                  updateCdps,
                  selectedCdps,
                  setSelectedCdps,
                  ratio
                })}
              </FadeInFromSide>
            );
          })}
        </Flex>
      </Grid>
    </FlowBackground>
  );
}
