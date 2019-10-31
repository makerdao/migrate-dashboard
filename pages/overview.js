import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import Header from '@makerdao/ui-components-header';
import { Box, Flex, Text, Grid, Button, Card, Link } from '@makerdao/ui-components-core';
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
  const [dai, setDai] = useState(null);

  useEffect(() => {
    if (maker && !account) Router.replace('/');
  }, [maker, account]);

  useEffect(() => {
    (async () => {
      if (!maker || !account) return;
      const mig = maker.service('migration');
      const checks = await mig.runAllChecks();
      setCdps(checks['single-to-multi-cdp']);
      setDai(checks['sdai-to-mdai'])
    })();
  }, [maker, account]);

  return (
    <Flex flexDirection="column" minHeight="100vh">
      <Header />
      <Box borderBottom="1px solid" borderColor="grey.300" />
      <div>
        <Subheading account={account} />
      </div>

      <Box maxWidth="112.5rem" width="100%" mx="auto" px="m" flexGrow="1">
        <Box mt={{ s: 'm', m: '2xl' }} maxWidth="64.2rem" width="100%">
          <Text.h2 mb="s">Migrate and Upgrade</Text.h2>
          <Breakout>
            Use Migrate after system updates to move your Dai, MKR, and CDPs into their new versions.
          </Breakout>
        </Box>

        <Grid
          mt="l"
          gridTemplateColumns={{ s: '1fr', l: '1fr 1fr' }}
          gridGap="l"
        >
        { cdps ?
          <Migration
            recommended
            title="CDP Migrate"
            metadataTitle="CDPs to migrate"
            metadataValue={showCdpCount(cdps)}
            body="Migrate your CDPs to the newest version of the CDP Portal."
            //body="Migrate your Single Collateral Dai CDPs to Multi Collateral Dai Vaults."
            onSelected={() => Router.push('/migration/cdp')}
          />
          : false }
        { dai ?
          <Migration
            recommended
            title="Single Collateral Dai Redeemer"
            body="Redeem your Single Collateral Dai (SCD) into Multi Collateral Dai (MCD)."
            metadataTitle="SCD Balance"
            metadataValue={"$0.00"}
            onSelected={() => Router.replace('/migration/dai')}
          />
          : false }
        {/* { mkr ?
          <Migration
            recommended
            title="DSChief MKR Withdrawal"
            body="Due to the recent discovery of a potential exploit in the Maker Governance Contract (DSChief), all users are requested to withdraw any MKR deposited into one of the voting contracts back to their wallet."
            metadataTitle="SCD Balance"
            metadataValue="1,400.00 DAI"
            onSelected={showModal}
          />
          : false }
        */}
        </Grid>
        {!dai && !cdps
          ? <Card mt="l">
            <Flex justifyContent="center" py="l" px="m">
              <Text.p textAlign="center" t="body">
                You're all set! There are no migrations or redemptions to make using this wallet.
                <br/>
                <Text.span display={{ s: 'block', m: 'none' }} mt='m'/>
                Please visit us at <Link>chat.makerdao.com</Link> if you have any questions.
              </Text.p>
            </Flex>
          </Card>
          : false
        }
      </Box>
      <Footer mt="2xl" />
    </Flex>
  );
}

export default Overview;
