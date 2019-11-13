import React, { useState, useEffect } from 'react';
import { Stepper, Grid, Flex } from '@makerdao/ui-components-core';
import Router from 'next/router';
import FlowBackground from '../../components/FlowBackground';
import FlowHeader from '../../components/FlowHeader';
import FadeInFromSide from '../../components/FadeInFromSide';
import SelectCDP from '../../components/migratecdp/SelectCDP';
import DeployProxy from '../../components/migratecdp/DeployProxy';
import PayAndMigrate from '../../components/migratecdp/PayAndMigrate';
import InProgress from '../../components/InProgress';
import Complete from '../../components/migratecdp/Complete';
import useMaker from '../../hooks/useMaker';
import round from 'lodash/round';
import useStore from '../../hooks/useStore';

const steps = [
  props => <SelectCDP {...props} />,
  props => <DeployProxy {...props} />,
  props => <PayAndMigrate {...props} />,
  props => <InProgress {...props} title="Your CDP is being migrated" />,
  props => <Complete {...props} />
];

async function getCdpData(cdp) {
  const debtValueExact = await cdp.getDebtValue();
  const debtValue = debtValueExact.toNumber().toFixed(2);
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
    debtValueExact,
    debtValue,
    // govFeeDai,
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

const ownedByProxy = cdp => 'dsProxyAddress' in cdp;

function MigrateCDP() {
  const { maker, account } = useMaker();
  const [currentStep, setCurrentStep] = useState(0);
  const [cdps, setCdps] = useState([]);
  const [loadingCdps, setLoadingCdps] = useState(true);
  const [selectedCDP, setSelectedCDP] = useState({});
  const [migrationTxHash, setMigrationTxHash] = useState(null);
  const [migrationTxObject, setMigrationTxObject] = useState({});
  const [newCdpId, setNewCdpId] = useState({});

  useEffect(() => {
    if (!account) Router.replace('/');
  }, [account]);

  const [{ cdpMigrationCheck }] = useStore();

  useEffect(() => {
    (async () => {
      if (!maker || !account) return;
      setCdps(await getAllCdpData(cdpMigrationCheck, maker));
      setLoadingCdps(false);
    })();
  }, [maker, account, cdpMigrationCheck]);

  const onPrev = () => {
    if (currentStep <= 0) Router.replace('/overview');
    setCurrentStep(
      ownedByProxy(selectedCDP) && currentStep === 2
        ? currentStep - 2
        : currentStep - 1
    );
  };

  const onNext = () =>
    setCurrentStep(
      ownedByProxy(selectedCDP) && currentStep === 0
        ? currentStep + 2
        : currentStep + 1
    );
  const onReset = () => setCurrentStep(0);

  useEffect(() => {
    if (migrationTxObject instanceof Promise) {
      migrationTxObject.then(id => {
        setNewCdpId(id);
        setCurrentStep(c => c + 1);
        setCdps(cdps => cdps.filter(c => c !== selectedCDP));
      });
    }
  }, [migrationTxObject, maker, selectedCDP]);

  return (
    <FlowBackground open={true}>
      <Grid gridRowGap={['m', 'xl']}>
        <FlowHeader
          account={account}
          hash={newCdpId.hash}
          showClose={currentStep <= 2}
        />
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
                  onPrev,
                  onNext,
                  onSelect: setSelectedCDP,
                  onReset,
                  cdps,
                  loadingCdps,
                  selectedCDP,
                  migrationTxObject,
                  setMigrationTxObject,
                  newCdpId,
                  setMigrationTxHash,
                  migrationTxHash
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
