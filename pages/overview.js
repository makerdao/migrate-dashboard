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
import { bytesToString } from '../utils/ethereum';
import { Breakout } from '../components/Typography';
import ButtonCard from '../components/ButtonCard';
import Subheading from '../components/Subheading';
import useStore from '../hooks/useStore';
import { SAI, DAI } from '../maker';

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
        <Box gridArea="body">{body}</Box>
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

function parseClaims(claims) {
  console.log(claims, 'clams');
  return claims.filter(c => c.redeemable);
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
      daiAvailable,
      oldMkrBalance,
      chiefMigrationCheck,
      vaultsToRedeem
    },
    dispatch
  ] = useStore();

  console.log('vaultsToRedeem', vaultsToRedeem);
  // console.log('chiefMigrationCheck', chiefMigrationCheck);

  useEffect(() => {
    if (maker && !account) Router.replace('/');
  }, [maker, account]);

  useEffect(() => {
    (async () => {
      if (!maker || !account) return;
      const mig = maker.service('migration');
      const checks = await mig.runAllChecks();
      const claims = checks['global-settlement-collateral-claims'];
      const validClaims = claims.filter(c => c.redeemable);

      const vaultsData = await Promise.all([
        ...validClaims.map(({ id }) =>
          maker.service('mcd:cdpManager').getCdp(parseInt(id))
        )
      ]);

      const parsedVaultsData = vaultsData.map(vault => {
        const claim = validClaims.find(c => c.id.toNumber() === vault.id);
        const currency = vault.type.ilk.split('-')[0];
        const vaultValue = vault.collateralAmount.toBigNumber().minus(vault.debtValue.toBigNumber().times(claim.tag));
        return {
          id: vault.id,
          type: currency,
          collateral: vault.collateralAmount.toString(),
          daiDebt: `${prettifyNumber(vault.debtValue, false, 2, false)} DAI`,
          vault,
          exchangeRate: `1 DAI : ${prettifyNumber(claim.tag, false, 4)} ${currency}`,
          vaultValue: `${prettifyNumber(vaultValue)} ${currency}`
        };
      });

      const _daiBalance = DAI(await maker.getToken('MDAI').balance());
      
      setInitialFetchComplete(true);
      dispatch({
        type: 'assign',
        payload: {
          cdpMigrationCheck: checks['single-to-multi-cdp'],
          saiBalance: SAI(checks['sai-to-dai']),
          daiBalance: _daiBalance,
          oldMkrBalance: checks['mkr-redeemer'],
          chiefMigrationCheck: checks['chief-migrate'],
          vaultsToRedeem: { claims: validClaims, parsedVaultsData }
        }
      });
    })();
  }, [maker, account, dispatch]);

  const { mkrLockedDirectly, mkrLockedViaProxy } = chiefMigrationCheck || {};

  const shouldShowCdps = countCdps(cdps) > 0;
  const shouldShowDai = saiBalance && saiBalance.gt(0);
  const shouldShowMkr = oldMkrBalance && oldMkrBalance.gt(0);
  const shouldShowReverse = daiBalance && daiBalance.gt(0);
  const shouldShowChief =
    chiefMigrationCheck && (mkrLockedDirectly.gt(0) || mkrLockedViaProxy.gt(0));
  const shouldShowCollateral = daiBalance && daiBalance.gt(0);
  const shouldShowRedeemVaults = vaultsToRedeem && vaultsToRedeem.claims;

  const noMigrations =
    !shouldShowCdps &&
    !shouldShowDai &&
    !shouldShowMkr &&
    !shouldShowReverse &&
    !shouldShowChief &&
    !shouldShowRedeemVaults;

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
              body={
                <Text.p t="body">
                  {`Upgrade your CDPs to Multi-Collateral Dai and Oasis. Current Sai liquidity: ${prettifyNumber(
                    saiAvailable
                  )}`}
                </Text.p>
              }
              onSelected={() => Router.push('/migration/cdp')}
            />
          )}
          {shouldShowDai && (
            <MigrationCard
              recommended
              title="Single-Collateral Sai Upgrade"
              body={
                <Text.p t="body">
                  {`Upgrade your Single-Collateral Sai to Multi-Collateral Dai. Current Dai availability: ${prettifyNumber(
                    daiAvailable
                  )}`}
                </Text.p>
              }
              metadataTitle="Sai to upgrade"
              metadataValue={showAmount(saiBalance)}
              onSelected={() => Router.push('/migration/dai')}
            />
          )}
          {shouldShowReverse && (
            <MigrationCard
              recommended
              title="Swap Dai for Sai"
              body={
                <Text.p t="body">
                  {`Swap your Multi-Collateral Dai back to Single-Collateral Sai. Current Sai liquidity: ${prettifyNumber(
                    saiAvailable
                  )}`}
                </Text.p>
              }
              metadataTitle="Dai available to swap"
              metadataValue={showAmount(daiBalance)}
              onSelected={() => {
                Router.push('/migration/sai');
              }}
            />
          )}
          {shouldShowChief && (
            <MigrationCard
              recommended
              title="DSChief MKR Withdrawal"
              body={
                <Text.p t="body">
                  {
                    'Due to the recent discovery of a potential exploit in the Maker Governance Contract (DSChief), all users are requested to withdraw any MKR deposited into one of the voting contracts back to their wallet.'
                  }
                </Text.p>
              }
              metadataTitle="MKR to claim"
              metadataValue={showAmount(
                mkrLockedDirectly.plus(mkrLockedViaProxy)
              )}
              onSelected={() => {
                window.open('https://chief-migration.makerdao.com/', '_blank');
              }}
            />
          )}
          {shouldShowRedeemVaults && (
            <MigrationCard
              recommended
              title="Withdraw Excess Collateral from Vaults"
              body={
                <Text.p t="body">
                  {
                    'Withdraw excess collateral from your Multi-Collateral Dai Vaults.'
                  }
                </Text.p>
              }
              metadataTitle="vaults to redeem"
              metadataValue={vaultsToRedeem.claims.length}
              onSelected={() => Router.push('/migration/vaults')}
            />
          )}
          {shouldShowMkr && (
            <MigrationCard
              recommended
              title="Redeem New MKR"
              body={
                <Text.p t="body">
                  {
                    'Swap your old MKR for new MKR by upgrading to the new ds-token.'
                  }
                </Text.p>
              }
              onSelected={() => {
                window.open('https://makerdao.com/redeem/', '_blank');
              }}
            />
          )}

          {shouldShowCollateral && (
            <MigrationCard
              recommended
              title="Redeem Dai for collateral"
              body={
                <Grid gridRowGap="l">
                  <Text.p t="body">
                    {
                      'Redeem your Dai for a proportional amount of underlying collateral from the Multi-Collateral Dai system'
                    }
                  </Text.p>
                  <Text.p
                    fontSize="15px"
                    fontWeight={500}
                    color={getColor('steel')}
                  >
                    {'Auctions in progress. Cooldown period ends in 5:34:03'}
                  </Text.p>
                </Grid>
              }
              metadataTitle="Dai to redeem"
              metadataValue={showAmount(daiBalance)}
              onSelected={() => {
                Router.push('/migration/redeemDai');
              }}
            />
          )}
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
