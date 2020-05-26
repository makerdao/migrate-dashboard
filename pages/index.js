import React, { useEffect } from 'react';
import Header from '@makerdao/ui-components-header';
import Footer from '@makerdao/ui-components-footer';
import { Box, Flex, Text, Grid } from '@makerdao/ui-components-core';
import { Breakout } from '../components/Typography';
import WalletManager from '../components/WalletManager';
import useStore from '../hooks/useStore';
import useMaker from '../hooks/useMaker';
import { getWebClientProviderName } from '../utils/web3';
import { prettifyNumber } from '../utils/ui';
import { SAI, DAI } from '../maker';

async function getStartingData(maker) {
  const mig = await maker
    .service('migration')
    .getMigration('single-to-multi-cdp');
  const daiToken = maker.service('token').getToken('DAI');
  const [systemWideDebtCeiling, daiSupply, dsrAnnual] = await Promise.all([
    maker.service('mcd:systemData').getSystemWideDebtCeiling(),
    daiToken.totalSupply().then(s => s.toNumber()),
    maker.service('mcd:savings').getYearlyRate()
  ]);
  const saiIlk = maker.service('mcd:cdpType').getCdpType(null, 'SAI');
  const { debtCeiling, totalDebt } = saiIlk;
  const systemHeadroom = DAI(systemWideDebtCeiling).minus(daiSupply);
  const saiHeadroom = debtCeiling.gt(totalDebt)
    ? DAI(debtCeiling.minus(totalDebt))
    : DAI(0);
  return {
    dsrAnnual,
    saiAvailable: SAI(await mig.migrationSaiAvailable()),
    daiAvailable: systemHeadroom.lt(saiHeadroom) ? systemHeadroom : saiHeadroom
  };
}

function Index() {
  const [{ providerName, saiAvailable }, dispatch] = useStore();
  const { maker } = useMaker();

  useEffect(() => {
    dispatch({
      type: 'assign',
      payload: {
        providerName: getWebClientProviderName()
      }
    });
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      if (!maker) return;
      const payload = await getStartingData(maker);
      dispatch({ type: 'assign', payload });
    })();
  }, [dispatch, maker]);

  return (
    <Flex flexDirection="column" minHeight="100vh">
      <Header />
      <Grid
        maxWidth="113.4rem"
        width="100%"
        m="0 auto"
        px="m"
        pt={{ s: 'm', l: 'xl' }}
        pb={{ s: 'xl', l: 'm' }}
        gridTemplateColumns={{ s: '1fr', l: 'auto' }}
        gridColumnGap="xl"
        gridRowGap="m"
      >
        <Box
          maxWidth="71.6rem"
          width="100%"
          mt="xl"
          textAlign={{ s: 'center', l: 'center' }}
          justifySelf={{ s: 'center', l: 'center' }}
        >
          <Text.h1 alignSelf="center" mb="s">
            Migrate and Upgrade
          </Text.h1>
          <Breakout>
            Use Migrate after system updates to move your Dai and CDPs into
            their new versions. Connect your wallet to view available migrations
            on your account.
          </Breakout>
        </Box>
      </Grid>
      <Text.h4
        fontSize="1.9rem"
        alignSelf="center"
        mb="s"
        mt="s"
        color="#546978"
      >
        Connect a wallet to get started
      </Text.h4>
      <Grid
        maxWidth="113.4rem"
        width="100%"
        m="0 auto"
        px="m"
        pb={{ s: 'xl', l: 'l' }}
        gridTemplateColumns={{ s: '1fr', l: 'auto' }}
        gridColumnGap="xl"
        gridRowGap="m"
      >
        <WalletManager providerName={providerName} />
      </Grid>
      {!!saiAvailable && (
        <Text m="0 auto" mb="m">
          Sai available for CDP migration: {prettifyNumber(saiAvailable)}
        </Text>
      )}
      <Box width="100%" height="75px" />
      <Footer />
    </Flex>
  );
}

export default Index;
