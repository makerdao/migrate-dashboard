import React, { useState, useEffect } from 'react';
import { Stepper, Grid, Text, Flex, Box } from '@makerdao/ui-components-core';
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
import round from 'lodash/round';
import crossCircle from '../../assets/icons/crossCircle.svg';

const steps = [
  props => <SelectCDP {...props} />,
  props => <DeployProxy {...props} />,
  props => <PayAndMigrate {...props} />,
  props => <Migrating {...props} />,
  props => <Complete {...props} />
];

async function getCdpData(cdp) {
  const debtValue = (await cdp.getDebtValue()).toNumber().toFixed(2);
  const govFeeMKRExact = await cdp.getGovernanceFee();
  const govFeeMKR =
    govFeeMKRExact.toNumber() > 0.01
      ? govFeeMKRExact.toNumber().toFixed(2)
      : round(govFeeMKRExact.toNumber(), 6);
  // const govFeeDai = (await cdp.getGovernanceFee(Maker.USD))
  //   .toNumber()
  //   .toFixed(2);
  const collateralizationRatio = (
    (await cdp.getCollateralizationRatio()) * 100
  ).toFixed(2);
  return {
    collateralizationRatio,
    debtValue,
    // govFeeDai,
    govFeeMKR,
    govFeeMKRExact
  };
}

function MigrateCDP() {
  const { maker, account } = useMaker();
  const [currentStep, setCurrentStep] = useState(0);
  const [cdps, setCdps] = useState([]);
  const [loadingCdps, setLoadingCdps] = useState(true);
  const [selectedCDP, setSelectedCDP] = useState({});
  const [migrationTxObject, setMigrationTxObject] = useState({});
  const [saiAvailable, setSaiAvailable] = useState(0);

  useEffect(() => {
    if (!account) Router.replace('/');
  }, [account]);

  useEffect(() => {
    (async () => {
      if (!maker || !account) return;
      const mig = await maker
        .service('migration')
        .getMigration('single-to-multi-cdp');
      const allCDPs = await mig.check();
      const saiAvailable = (await mig.migrationSaiAvailable()).toNumber();
      setSaiAvailable(saiAvailable);
      const accounts = Object.keys(allCDPs);
      let fetchedCDPs = [];
      await Promise.all(
        accounts.map(account =>
          Promise.all(
            allCDPs[account].map(async cdpId => {
              let cdp = await maker.getCdp(cdpId);
              let data = await getCdpData(cdp, maker);
              fetchedCDPs = fetchedCDPs
                .concat({ ...cdp, ...data, give: cdp.give })
                .sort(
                  (a, b) => parseFloat(b.debtValue) - parseFloat(a.debtValue)
                );
              setCdps(fetchedCDPs);
            })
          )
        )
      );
      setLoadingCdps(false);
    })();
  }, [maker, account]);

  const ownedByProxy = cdp => {
    return 'dsProxyAddress' in cdp;
  };

  const toPrevStepOrClose = () => {
    if (currentStep <= 0) Router.replace('/overview');
    setCurrentStep(
      ownedByProxy(selectedCDP) && currentStep === 2
        ? currentStep - 2
        : currentStep - 1
    );
  };
  const toNextStep = () =>
    setCurrentStep(
      ownedByProxy(selectedCDP) && currentStep === 0
        ? currentStep + 2
        : currentStep + 1
    );
  const reset = () => setCurrentStep(0);
  const selectCDP = cdp => {
    setSelectedCDP(cdp);
  };
  return (
    <FlowBackground open={true}>
      <Grid gridRowGap={['m', 'xl']}>
        <Grid
          justifyContent={['space-between', 'flex-end']}
          gridTemplateColumns="auto auto"
          gridColumnGap="m"
          pt={['m', 'xl']}
          px="m"
        >
          <Box bg={['white', 'rgba(0,0,0,0)']} p={['s']} style={{borderRadius: 6}}>
            {account ? <Account account={account} /> : null}
          </Box>
          <Flex
            alignItems="center"
            onClick={() => Router.replace('/overview')}
            css={{ cursor: 'pointer' }}
          >
            <img src={crossCircle} />
            &nbsp;
            <Text color="steel" fontWeight="medium" display={{ s: 'none' }}>
              Close
            </Text>
          </Flex>
        </Grid>
        <Stepper
          steps={['Select CDP', 'Deploy Proxy', 'Pay & Migrate']}
          selected={currentStep}
          mt={{ s: '10px' }}
          m="0 auto"
          p={['0 80px', '0']}
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
                  onSelect: selectCDP,
                  onReset: reset,
                  cdps,
                  loadingCdps,
                  saiAvailable,
                  selectedCDP,
                  migrationTxObject,
                  setMigrationTxObject
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
