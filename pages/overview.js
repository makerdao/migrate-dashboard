import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import Header from '@makerdao/ui-components-header';
import { Box, Flex, Text, Grid, Button } from '@makerdao/ui-components-core';
import useMaker from '../hooks/useMaker';
import reduce from 'lodash/reduce';
import { Breakout } from '../components/Typography';
import ButtonCard from '../components/ButtonCard';
import Subheading from '../components/Subheading';
import Footer from '../components/Footer';

function Migration({
  title,
  body,
  recommended,
  metadataTitle,
  metadataValue,
  onSelected
}) {
  return (
    <ButtonCard
      minHeight="25.3rem"
      buttonTag={
        <Grid gridRowGap="2xs">
          <Text t="subheading" color="darkLavender">
            {metadataTitle}
          </Text>
          <Text t="body">{metadataValue}</Text>
        </Grid>
      }
      button={
        <Button
          px="xl"
          variant={recommended ? 'primary' : 'secondary-outline'}
          onClick={onSelected}
        >
          Continue
        </Button>
      }
    >
      <Grid
        gridTemplateAreas='"title recommended" "body body"'
        gridTemplateColumns="1fr auto"
        gridColumnGap="m"
        gridRowGap="m"
      >
        <Box gridArea="title" alignSelf="center">
          <Text.h4>{title}</Text.h4>
        </Box>
        <Box gridArea="body">
          <Text.p t="body">{body}</Text.p>
        </Box>
      </Grid>
    </ButtonCard>
  );
}

function showCdpCount(cdps) {
  if (cdps === null) return '...';
  return reduce(cdps, (count, list) => count + list.length, 0);
}

function Overview() {
  const { maker, account } = useMaker();
  const [cdps, setCdps] = useState(null);

  // note that this doesn't prevent the rest of rendering from happening
  if (typeof window !== 'undefined' && !account) Router.replace('/');

  useEffect(() => {
    (async () => {
      if (!maker) return;
      const mig = maker.service('migration');
      const checks = await mig.runAllChecks();
      setCdps(checks['single-to-multi-cdp']);
    })();
  }, [maker]);

  return (
    <Flex flexDirection="column" minHeight="100vh">
      <Header />
      <Box borderBottom="1px solid" borderColor="grey.300" />
      <div>
        <Subheading account={account} />
      </div>

      <Box maxWidth="112.5rem" width="100%" mx="auto" px="m" flexGrow="1">
        <Box mt={{ s: 'm', m: '2xl' }} maxWidth="64.2rem" width="100%">
          <Text.h2 mb="s">Migrate and Redeem</Text.h2>
          <Breakout>
            Upgrade your DAI, MKR, and CDPs to their respective updated
            versions. Redeem and withdraw collateral during emergency shutdown.
          </Breakout>
        </Box>

        <Grid
          mt="l"
          gridTemplateColumns={{ s: '1fr', l: '1fr 1fr' }}
          gridGap="l"
        >
          <Migration
            recommended
            title="Migrate CDPs"
            metadataTitle="CDPs to migrate"
            metadataValue={showCdpCount(cdps)}
            body="Migrate your Sai CDPs to MCD Vaults."
            onSelected={() => Router.replace('/migration/cdp')}
          />
          {/*<Migration
            title="Dai Redeemer"
            body="Redeem your Dai holdings into either Single Collateral Dai (SCD) or Multi Collateral Dai (MCD)."
            metadataTitle="SCD Balance"
            metadataValue="1,400.00 DAI"
            onSelected={showModal}
          />*/}
        </Grid>

        <Box mt="xl">
          <Text.p t="body" fontSize="s" color="steelLight" textAlign="center">
            No other migrations or redemptions to make in this wallet.
          </Text.p>
        </Box>

        {/*
        <Card mt="l">
        <Flex justifyContent="center" py="l" px="m">
          <Text.p textAlign="center" t="body">
            You're all set! There are no migrations or redemptions to make using this wallet.
            <br/>
            <Text.span display={{ s: 'block', m: 'none' }} mt='m'/>
            Please visit us at <Link>chat.makerdao.com</Link> if you have any questions.
          </Text.p>
        </Flex>
      </Card>
      */}
      </Box>
      <Footer mt="2xl" />
    </Flex>
  );
}

export default Overview;
