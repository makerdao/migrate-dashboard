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
  Loader,
  Tooltip
} from '@makerdao/ui-components-core';
import useMaker from '../hooks/useMaker';
import reduce from 'lodash/reduce';
import { getColor } from '../utils/theme';
import { prettifyNumber } from '../utils/ui';
import { Breakout } from '../components/Typography';
import ButtonCard from '../components/ButtonCard';
import Subheading from '../components/Subheading';
import useStore from '../hooks/useStore';
import { SAI, DAI } from '../maker';
import TooltipContents from '../components/TooltipContents';
import { stringToBytes, fromRay, fromRad } from '../utils/ethereum';

function clock(delta) {
  // const days = Math.floor(delta / 86400);
  // delta -= days * 86400;

  const hours = Math.floor(delta / 3600);
  delta -= hours * 3600;

  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  const seconds = delta % 60;

  const pad = val => (val < 10 ? '0' + val.toString() : val.toString());

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

const Timer = ({ seconds }) => {
  // initialize timeLeft with the seconds prop
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (!timeLeft) return;

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  return (
    <Flex>
      <Text.p fontSize="15px" fontWeight={500} color={getColor('steel')}>
        {`Auctions in progress. Cooldown period ends in ${clock(timeLeft)}`}
      </Text.p>
      <Tooltip
        fontSize="m"
        ml="xs"
        color={getColor('steel')}
        content={
          <TooltipContents>
            Dai holders need to wait for the cooldown period to complete because
            vaults have priority as their debt needs to be cleared first. This
            will allow the correct amount of underlying collateral to be
            calculated as part of your Dai redemption.
          </TooltipContents>
        }
      />
    </Flex>
  );
};

function MigrationCard({
  title,
  children,
  metadataTitle,
  metadataValue,
  onSelected,
  buttonLabel = 'Continue',
  disabled = false
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
          disabled={disabled}
          variant="primary"
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
        <Box gridArea="body">{children}</Box>
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

function OverviewDataFetch() {
  const [, dispatch] = useStore();
  const { maker, account } = useMaker();
  const [fetching, setFetching] = useState(true);

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

      const end = maker.service('smartContract').getContract('MCD_END_1');
      const [
        live,
        wait,
        when,
        systemDebt,
        ethFixedPrice,
        batFixedPrice
      ] = await Promise.all([
        end.live(),
        end.wait(),
        end.when(),
        end.debt().then(fromRad),
        ...['ETH-A', 'BAT-A'].map(ilk =>
          end.fix(stringToBytes(ilk)).then(fromRay)
        )
      ]);
      const emergencyShutdownActive = live.eq(0);
      const emergencyShutdownTime = new Date(when.toNumber() * 1000);
      const auctionCloseTime = new Date(
        emergencyShutdownTime.getTime() + wait.toNumber() * 1000
      );

      const diff = Math.floor((auctionCloseTime.getTime() - Date.now()) / 1000);

      const secondsUntilAuctionClose = diff > 0 ? diff : 0;

      const fixedPrices = [
        { ilk: 'ETH-A', price: ethFixedPrice },
        { ilk: 'BAT-A', price: batFixedPrice }
      ];

      const parsedVaultsData = vaultsData.map(vault => {
        const claim = validClaims.find(c => c.id.toNumber() === vault.id);
        const currency = vault.type.ilk.split('-')[0];
        const vaultValue = vault.collateralAmount
          .toBigNumber()
          .minus(vault.debtValue.toBigNumber().times(claim.tag));
        return {
          id: vault.id,
          type: currency,
          collateral: vault.collateralAmount.toString(),
          daiDebt: `${prettifyNumber(vault.debtValue, false, 2, false)} DAI`,
          vault,
          exchangeRate: `1 DAI : ${prettifyNumber(
            claim.tag,
            false,
            4
          )} ${currency}`,
          vaultValue: `${prettifyNumber(vaultValue)} ${currency}`
        };
      });

      const _daiBalance = DAI(await maker.getToken('MDAI').balance());
      const proxyAddress = await maker.service('proxy').currentProxy();
      const _bagBalance = DAI(await maker
        .service('migration')
        .getMigration('global-settlement-dai-redeemer')
        .bagAmount(proxyAddress));
      const _dsrBalance = await maker.service('mcd:savings').balance();
      const _daiDsrBagBalance = _daiBalance.plus(_bagBalance).plus(_dsrBalance);

      const tub = maker.service('smartContract').getContract('SAI_TUB');
      const tubState = {
        per: await tub.per(), // WETH/PETH ratio 
        off: true, //await tub.off(), // SCD is shut down
        out: false //await tub.out() // cooldown ended
      };

      setFetching(false);

      dispatch({
        type: 'assign',
        payload: {
          emergencyShutdownActive,
          emergencyShutdownTime,
          secondsUntilAuctionClose,
          systemDebt,
          fixedPrices,
          cdpMigrationCheck: checks['single-to-multi-cdp'],
          saiBalance: SAI(checks['sai-to-dai']),
          daiBalance: _daiBalance,
          bagBalance: _bagBalance,
          dsrBalance: _dsrBalance,
          daiDsrBagBalance: _daiDsrBagBalance,
          oldMkrBalance: checks['mkr-redeemer'],
          chiefMigrationCheck: checks['chief-migrate'],
          vaultsToRedeem: { claims: validClaims, parsedVaultsData },
          tubState
        }
      });
    })();
  }, [maker, account, dispatch]);

  return <Overview fetching={fetching} />;
}

function Overview({ fetching }) {
  const { account } = useMaker();
  const [
    {
      emergencyShutdownActive,
      secondsUntilAuctionClose,
      systemDebt,
      fixedPrices,
      cdpMigrationCheck: cdps,
      saiBalance,
      daiBalance,
      daiDsrBagBalance,
      saiAvailable,
      daiAvailable,
      oldMkrBalance,
      chiefMigrationCheck,
      vaultsToRedeem,
      tubState = {}
    }
  ] = useStore();

  const { mkrLockedDirectly, mkrLockedViaProxy } = chiefMigrationCheck || {};
  const shouldShowCdps = countCdps(cdps) > 0;
  const shouldShowDai = saiBalance && saiBalance.gt(0);
  const shouldShowMkr = oldMkrBalance && oldMkrBalance.gt(0);
  const shouldShowReverse = daiBalance && daiBalance.gt(0);
  const shouldShowChief =
    chiefMigrationCheck && (mkrLockedDirectly.gt(0) || mkrLockedViaProxy.gt(0));
  const shouldShowCollateral =
    daiDsrBagBalance &&
    daiDsrBagBalance.gt(0) &&
    emergencyShutdownActive &&
    secondsUntilAuctionClose !== undefined &&
    systemDebt !== undefined &&
    fixedPrices !== undefined;
  const shouldShowRedeemVaults =
    vaultsToRedeem && vaultsToRedeem.claims.length > 0;

  // console.log(tubState);
  const shouldShowSCDESCollateral = tubState.off && countCdps(cdps) > 0;
  const shouldShowSCDESSai = tubState.off && shouldShowDai;

  const noMigrations =
    !shouldShowCdps &&
    !shouldShowDai &&
    !shouldShowMkr &&
    !shouldShowReverse &&
    !shouldShowChief &&
    !shouldShowCollateral &&
    !shouldShowRedeemVaults &&
    !shouldShowSCDESCollateral &&
    !shouldShowSCDESSai;

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
              title="CDP Upgrade"
              metadataTitle={`CDP${
                countCdps(cdps) === 1 ? '' : 's'
              } to upgrade`}
              metadataValue={showCdpCount(cdps)}
              onSelected={() => Router.push('/migration/cdp')}
            >
              <Text.p t="body">
                Upgrade your CDPs to Multi-Collateral Dai and Oasis. Current Sai
                liquidity: {prettifyNumber(saiAvailable)}
              </Text.p>
            </MigrationCard>
          )}
          {shouldShowDai && (
            <MigrationCard
              title="Single-Collateral Sai Upgrade"
              metadataTitle="Sai to upgrade"
              metadataValue={showAmount(saiBalance)}
              onSelected={() => Router.push('/migration/dai')}
            >
              <Text.p t="body">
                Upgrade your Single-Collateral Sai to Multi-Collateral Dai.
                Current Dai availability: {prettifyNumber(daiAvailable)}
              </Text.p>
            </MigrationCard>
          )}
          {shouldShowReverse && (
            <MigrationCard
              title="Swap Dai for Sai"
              metadataTitle="Dai available to swap"
              metadataValue={showAmount(daiBalance)}
              onSelected={() => {
                Router.push('/migration/sai');
              }}
            >
              <Text.p t="body">
                Swap your Multi-Collateral Dai back to Single-Collateral Sai.
                Current Sai liquidity: {prettifyNumber(saiAvailable)}
              </Text.p>
            </MigrationCard>
          )}
          {shouldShowChief && (
            <MigrationCard
              title="DSChief MKR Withdrawal"
              metadataTitle="MKR to claim"
              metadataValue={showAmount(
                mkrLockedDirectly.plus(mkrLockedViaProxy)
              )}
              onSelected={() => {
                window.open('https://chief-migration.makerdao.com/', '_blank');
              }}
            >
              <Text.p t="body">
                Due to the recent discovery of a potential exploit in the Maker
                Governance Contract (DSChief), all users are requested to
                withdraw any MKR deposited into one of the voting contracts back
                to their wallet.
              </Text.p>
            </MigrationCard>
          )}
          {shouldShowRedeemVaults && (
            <MigrationCard
              title="Withdraw Excess Collateral from Vaults"
              metadataTitle="vaults to redeem"
              metadataValue={vaultsToRedeem.claims.length}
              onSelected={() => Router.push('/migration/vaults')}
            >
              <Text.p t="body">
                Withdraw excess collateral from your Multi-Collateral Dai
                Vaults.
              </Text.p>
            </MigrationCard>
          )}
          {shouldShowMkr && (
            <MigrationCard
              recommended
              title="Redeem New MKR"
              onSelected={() => {
                window.open('https://makerdao.com/redeem/', '_blank');
              }}
            >
              <Text.p t="body">
                Swap your old MKR for new MKR by upgrading to the new ds-token.
              </Text.p>
            </MigrationCard>
          )}

          {shouldShowCollateral && (
            <MigrationCard
              title="Redeem Dai for collateral"
              metadataTitle="Dai to redeem"
              metadataValue={showAmount(daiDsrBagBalance)}
              onSelected={() => {
                Router.push('/migration/redeemDai');
              }}
              disabled={
                !systemDebt.gt(0) ||
                secondsUntilAuctionClose > 0 ||
                !fixedPrices.every(({ price }) => price.gt(0))
              }
            >
              <Grid gridRowGap="l">
                <Text.p t="body">
                  Redeem your Dai for a proportional amount of underlying
                  collateral from the Multi-Collateral Dai system
                </Text.p>
                {secondsUntilAuctionClose > 0 ? (
                  <Timer seconds={secondsUntilAuctionClose} />
                ) : !systemDebt.gt(0) ? (
                  <Text.p
                    fontSize="15px"
                    fontWeight={500}
                    color={getColor('steel')}
                  >
                    The end.thaw() function must be triggered before DAI can be
                    redeemed.
                  </Text.p>
                ) : !fixedPrices.every(({ price }) => price.gt(0)) ? (
                  <Text.p
                    fontSize="15px"
                    fontWeight={500}
                    color={getColor('steel')}
                  >
                    The end.flow() function must be executed on each collateral
                    type.
                  </Text.p>
                ) : (
                  'You can now redeem your DAI for collateral'
                )}
              </Grid>
            </MigrationCard>
          )}

          {shouldShowSCDESCollateral && (
            <MigrationCard
              title="Withdraw collateral from Sai CDPs"
              onSelected={() => Router.push('/migration/scd-es-cdp')}
            >
              <>
                <Text.p t="body">
                  Redeem collateral from your Single-Collateral Sai CDP for a
                  proportional amount of WETH.
                </Text.p>
                {!tubState.out && (
                  <Text.p t="body">
                    Sai redemption in progress. Cooldown period ends in
                    TODO
                  </Text.p>
                )}
              </>
            </MigrationCard>
          )}
          {shouldShowSCDESSai && (
            <MigrationCard
              title="Redeem Sai for collateral"
              onSelected={() => Router.push('/migration/scd-es-sai')}
            >
              <Text.p t='body'>
                Redeem your Sai for a proportional amount of WETH from the Single-Collateral Sai system.
              </Text.p>
            </MigrationCard>
          )}
        </Grid>
        {fetching ? (
          <Loader
            mt="4rem"
            mb="4rem"
            size="1.8rem"
            color={getColor('makerTeal')}
            justifySelf="end"
            m="auto"
            bg={getColor('lightGrey')}
          />
        ) : (
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
        )}
      </Box>
    </Flex>
  );
}

export default OverviewDataFetch;
