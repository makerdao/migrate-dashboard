import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import Header from '@makerdao/ui-components-header';
import {
  Box,
  Flex,
  Text,
  Grid,
  Button,
  Card,
  Link
} from '@makerdao/ui-components-core';
import useMaker from '../hooks/useMaker';
import reduce from 'lodash/reduce';
import { prettifyNumber } from '../utils/ui';
import { Breakout } from '../components/Typography';
import ButtonCard from '../components/ButtonCard';
import Subheading from '../components/Subheading';
import Footer from '../components/Footer';
import useStore from '../hooks/useStore';
import { OASIS_HOSTNAME } from '../utils/constants';

const DEV_BOOL_USE_OASIS_FOR_SAI_MIGRATION = true;

function Migration({
  title,
  body,
  recommended,
  metadataTitle,
  metadataValue,
  onSelected,
  buttonLabel = 'Continue'
}) {
  return (
    <ButtonCard
      minHeight="25.3rem"
      buttonTag={
        <Grid gridRowGap="2xs">
          <Text t="heading" color="teal.500" alignSelf="center">
            {metadataValue} {metadataTitle}
          </Text>
        </Grid>
      }
      button={
        <Button
          px="xl"
          variant={recommended ? 'primary' : 'secondary-outline'}
          onClick={onSelected}
        >
          {buttonLabel}
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

function countCdps(cdps) {
  return reduce(cdps, (count, list) => count + list.length, 0);
}

function showCdpCount(cdps) {
  if (!cdps) return '...';
  return countCdps(cdps);
}

function showAmount(tok) {
  if (!tok) return '...';
  return prettifyNumber(tok, false, 2, false);
}

function Overview() {
  const { maker, account } = useMaker();
  const [dai, setDai] = useState(null);
  const [{ cdpMigrationCheck: cdps, saiBalance }, dispatch] = useStore();

  useEffect(() => {
    if (maker && !account) Router.replace('/');
  }, [maker, account]);

  useEffect(() => {
    (async () => {
      if (!maker || !account) return;
      const mig = maker.service('migration');
      const checks = await mig.runAllChecks();
      dispatch({
        type: 'assign',
        payload: {
          cdpMigrationCheck: checks['single-to-multi-cdp'],
          saiBalance: checks['sai-to-dai']
        }
      });

      const daiBalance = await maker.getToken('MDAI').balance();
      setDai(daiBalance);
    })();
  }, [maker, account, dispatch]);

  // mocking as true for development
  const shouldShowCdps = true; // countCdps(cdps) >= 0;
  const shouldShowDai = true; // dai && dai.gt(0);
  const shouldShowReverse = true;

  const noMigrations = !shouldShowDai && !shouldShowCdps && !shouldShowReverse;

  return (
    <Flex flexDirection="column" minHeight="100vh">
      <Header />
      <Box borderBottom="1px solid" borderColor="grey.300" />
      <div>
        <Subheading account={account} />
      </div>

      <Box maxWidth="112.5rem" width="100%" mx="auto" px="m" flexGrow="1">
        <Box mt={{ s: 'm', m: '2xl' }} maxWidth="64.2rem" width="100%">
          <Text.h2 mb="s" textAlign={{ s: 'center', l: 'left' }}>
            Migrate and Upgrade
          </Text.h2>
          <Breakout textAlign={{ s: 'center', l: 'left' }}>
            Use Migrate after system updates to move your Dai, MKR, and CDPs
            into their new versions.
          </Breakout>
        </Box>

        <Grid
          mt="l"
          gridTemplateColumns={{ s: '1fr', l: '1fr 1fr' }}
          gridGap="l"
        >
          {shouldShowCdps && (
            <Migration
              recommended
              title="Migrate CDPs"
              metadataTitle={`CDP${
                countCdps(cdps) === 1 ? '' : 's'
              } to migrate`}
              metadataValue={showCdpCount(cdps)}
              body="Migrate your Single Collateral Dai CDPs to Multi Collateral Dai Vaults."
              onSelected={() => Router.push('/migration/cdp')}
            />
          )}
          {shouldShowDai && (
            <Migration
              recommended
              title="Single Collateral Dai Redeemer"
              body="Redeem your Single Collateral Dai (Sai) into Multi Collateral Dai."
              metadataTitle="Sai to redeem"
              metadataValue={showAmount(saiBalance)}
              onSelected={() => Router.push('/migration/dai')}
            />
          )}
          {shouldShowReverse && (
            <Migration
              recommended
              title="Downgrade Multi Collateral Dai"
              body="Downgrade your Multi Collateral Dai into Single Collateral Dai (Sai)."
              metadataTitle="Dai to redeem"
              metadataValue={showAmount(dai)}
              onSelected={() => {
                if (DEV_BOOL_USE_OASIS_FOR_SAI_MIGRATION)
                  window.location = `${OASIS_HOSTNAME}/trade`;
                else Router.push('/migration/sai');
              }}
              buttonLabel={
                DEV_BOOL_USE_OASIS_FOR_SAI_MIGRATION ? 'Visit Oasis' : undefined
              }
            />
          )}
          {/* { mkr &&
          <Migration
            recommended
            title="DSChief MKR Withdrawal"
            body="Due to the recent discovery of a potential exploit in the Maker Governance Contract (DSChief), all users are requested to withdraw any MKR deposited into one of the voting contracts back to their wallet."
            metadataTitle="SCD Balance"
            metadataValue="1,400.00 DAI"
            onSelected={showModal}
          />}
        */}
        </Grid>
        {noMigrations && (
          <Card mt="l">
            <Flex justifyContent="center" py="l" px="m">
              <Text.p textAlign="center" t="body">
                You&apos;re all set! There are no migrations or redemptions to
                make using this wallet.
                <br />
                <Text.span display={{ s: 'block', m: 'none' }} mt="m" />
                Please visit us at <Link>chat.makerdao.com</Link> if you have
                any questions.
              </Text.p>
            </Flex>
          </Card>
        )}
      </Box>
      <Footer mt="2xl" />
    </Flex>
  );
}

export default Overview;
