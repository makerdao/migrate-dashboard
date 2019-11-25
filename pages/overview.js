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
  Link,
  Loader
} from '@makerdao/ui-components-core';
import useMaker from '../hooks/useMaker';
import reduce from 'lodash/reduce';
import { getColor } from '../utils/theme';
import { prettifyNumber } from '../utils/ui';
import { Breakout } from '../components/Typography';
import ButtonCard from '../components/ButtonCard';
import Subheading from '../components/Subheading';
import useStore from '../hooks/useStore';
import { DAI } from '../maker';

function MigrationCard({
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
          <Text t="heading" color="teal.500" alignSelf="center" ml="s">
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
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);
  const [
    {
      cdpMigrationCheck: cdps,
      saiBalance,
      daiBalance,
      saiAvailable,
      daiAvailable
    },
    dispatch
  ] = useStore();

  useEffect(() => {
    if (maker && !account) Router.replace('/');
  }, [maker, account]);

  useEffect(() => {
    (async () => {
      if (!maker || !account) return;
      const mig = maker.service('migration');
      const checks = await mig.runAllChecks();
      const _daiBalance = DAI(await maker.getToken('MDAI').balance());
      setInitialFetchComplete(true);

      dispatch({
        type: 'assign',
        payload: {
          cdpMigrationCheck: checks['single-to-multi-cdp'],
          saiBalance: checks['sai-to-dai'],
          daiBalance: _daiBalance
        }
      });
    })();
  }, [maker, account, dispatch]);

  const shouldShowCdps = countCdps(cdps) > 0;
  const shouldShowDai = saiBalance && saiBalance.gt(0);
  const shouldShowReverse = daiBalance && daiBalance.gt(0);
  const noMigrations = !shouldShowDai && !shouldShowCdps && !shouldShowReverse;

  return (
    <Flex flexDirection="column" minHeight="100vh">
      <Header />
      <Box borderBottom="1px solid" borderColor="grey.300" />
      <div>
        <Subheading account={account} />
      </div>

      <Box maxWidth="112.5rem" width="100%" mx="auto" px="m" flexGrow="1">
        <Box mt={{ s: 'm', m: '2xl' }} maxWidth="82.2rem" width="100%">
          <Text.h2 mb="s" textAlign={{ s: 'center', l: 'left' }}>
            Migrate and Upgrade
          </Text.h2>
          <Breakout textAlign={{ s: 'center', l: 'left' }}>
            Use Migrate after system updates to move your Dai and CDPs into
            their new versions.
          </Breakout>
        </Box>

        <Grid
          mt="l"
          gridTemplateColumns={{ s: '1fr', l: '1fr 1fr' }}
          gridGap="l"
        >
          {shouldShowCdps && (
            <MigrationCard
              recommended
              title="CDP Upgrade"
              metadataTitle={`CDP${
                countCdps(cdps) === 1 ? '' : 's'
              } to upgrade`}
              metadataValue={showCdpCount(cdps)}
              body={`Upgrade your CDPs to Multi-Collateral Dai and Oasis. Current Sai liquidity: ${prettifyNumber(
                saiAvailable
              )}`}
              onSelected={() => Router.push('/migration/cdp')}
            />
          )}
          {shouldShowDai && (
            <MigrationCard
              recommended
              title="Single-Collateral Sai Upgrade"
              body={`Upgrade your Single-Collateral Sai to Multi-Collateral Dai. Current Dai availability: ${prettifyNumber(
                daiAvailable
              )} DAI`}
              metadataTitle="Sai to upgrade"
              metadataValue={showAmount(saiBalance)}
              onSelected={() => Router.push('/migration/dai')}
            />
          )}
          {shouldShowReverse && (
            <MigrationCard
              recommended
              title="Swap Dai for Sai"
              body={`Swap your Multi-Collateral Dai back to Single-Collateral Sai. Current Sai liquidity: ${prettifyNumber(
                saiAvailable
              )}`}
              metadataTitle="Dai available to swap"
              metadataValue={showAmount(daiBalance)}
              onSelected={() => {
                Router.push('/migration/sai');
              }}
            />
          )}
          {/* { mkr &&
          <MigrationCard
            recommended
            title="DSChief MKR Withdrawal"
            body="Due to the recent discovery of a potential exploit in the Maker Governance Contract (DSChief), all users are requested to withdraw any MKR deposited into one of the voting contracts back to their wallet."
            metadataTitle="SCD Balance"
            metadataValue="1,400.00 DAI"
            onSelected={showModal}
          />}
        */}
        </Grid>
        {initialFetchComplete ? (
          noMigrations && (
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
          )
        ) : (
          <Loader
            mt="4rem"
            mb="4rem"
            size="1.8rem"
            color={getColor('makerTeal')}
            justifySelf="end"
            m="auto"
            bg={getColor('lightGrey')}
          />
        )}
      </Box>
    </Flex>
  );
}

export default Overview;
