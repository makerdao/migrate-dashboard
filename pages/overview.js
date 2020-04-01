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
import flatten from 'lodash/flatten';
import reduce from 'lodash/reduce';
import { getColor } from '../utils/theme';
import { prettifyNumber } from '../utils/ui';
import { TextBlock, Breakout } from '../components/Typography';
import ButtonCard from '../components/ButtonCard';
import Subheading from '../components/Subheading';
import useStore from '../hooks/useStore';
import { SAI, DAI, ETH, PETH } from '../maker';
import TooltipContents from '../components/TooltipContents';
import { shutDown } from '../plugin/test/helpers';
import { stringToBytes, fromRay, fromRad, fromWei } from '../utils/ethereum';
import BigNumber from 'bignumber.js';
import ilkList from '../references/ilkList';

function clock(delta) {
  // const days = Math.floor(delta / 86400);
  // delta -= days * 86400;

  const hours = Math.floor(delta / 3600);
  delta -= hours * 3600;

  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  const seconds = Math.floor(delta) % 60;

  const pad = val => (val < 10 ? '0' + val.toString() : val.toString());

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

const Timer = ({ seconds, prefix, children }) => {
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
        {prefix} {clock(timeLeft)}
        <Tooltip
          fontSize="m"
          ml="xs"
          color={getColor('steel')}
          content={<TooltipContents>{children}</TooltipContents>}
        />
      </Text.p>
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
      // the following can be removed when we're done testing this
      if (global.scdESTest && global.testnet) {
        const off = await mig.getMigration('redeem-sai').off();
        if (!off) {
          console.log('shutting down');
          await shutDown();
        }
      }
      const checks = await mig.runAllChecks();

      const end = maker.service('smartContract').getContract('MCD_END_1');
      const live = await end.live();
      const emergencyShutdownActive = live.eq(0);
      if (emergencyShutdownActive) {
        const claims = checks['global-settlement-collateral-claims'];
        const validClaims = claims.filter(c => c.redeemable);

        const vaultsData = await Promise.all([
          ...validClaims.map(({ id }) =>
            maker.service('mcd:cdpManager').getCdp(parseInt(id))
          )
        ]);

        const fixElement = async ilk => {
          const price = await end.tag(stringToBytes(ilk)).then(fromRay);
          return {
            ilk,
            price
          };
        };

        const tagElement = async ilk => {
          const price = await end.tag(stringToBytes(ilk)).then(fromRay);
          return {
            ilk,
            price
          };
        };

        const ilkKeys = ilkList.map(i => i.key);

        const [
          wait,
          when,
          systemDebt,
          fixedPrices,
          tagPrices
        ] = await Promise.all([
          end.wait(),
          end.when(),
          end.debt().then(fromRad),
          Promise.all(ilkKeys.map(ilk =>
            fixElement(ilk)
          )),
          Promise.all(ilkKeys.map(ilk =>
            tagElement(ilk)
          ))
        ]);
        const emergencyShutdownTime = new Date(when.toNumber() * 1000);
        const auctionCloseTime = new Date(
          emergencyShutdownTime.getTime() + wait.toNumber() * 1000
        );

        const diff = Math.floor(
          (auctionCloseTime.getTime() - Date.now()) / 1000
        );

        const secondsUntilAuctionClose = diff > 0 ? diff : 0;

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
        let _endBalance = DAI(0);
        const _dsrBalance = await maker.service('mcd:savings').balance();
        let bagBalance = DAI(0);
        let outAmounts = [];
        if (proxyAddress) {
          const outElement = async ilk => {
            const out = await end.out(stringToBytes(ilk), proxyAddress).then(fromWei);
            return {
              ilk,
              out
            };
          };

          outAmounts = await Promise.all(ilkKeys.map(ilk =>
            outElement(ilk)
          ));

          bagBalance = DAI(
            await maker
              .service('migration')
              .getMigration('global-settlement-dai-redeemer')
              .bagAmount(proxyAddress)
          );
          _endBalance = bagBalance.minus(BigNumber.min.apply(null, outAmounts.map(o => o.out)));
        }
        const _daiDsrEndBalance = _daiBalance
          .plus(_endBalance)
          .plus(_dsrBalance);

        dispatch({
          type: 'assign',
          payload: {
            emergencyShutdownActive,
            emergencyShutdownTime,
            secondsUntilAuctionClose,
            systemDebt,
            fixedPrices,
            tagPrices,
            outAmounts,
            daiBalance: _daiBalance,
            endBalance: _endBalance,
            dsrBalance: _dsrBalance,
            bagBalance,
            proxyAddress,
            daiDsrEndBalance: _daiDsrEndBalance,
            vaultsToRedeem: { claims: validClaims, parsedVaultsData }
          }
        });
      }

      const scs = maker.service('smartContract');
      const tub = scs.getContract('SAI_TUB');
      const top = scs.getContract('SAI_TOP');
      const tubState = {
        per: await tub.per(), // WETH/PETH ratio
        off: await tub.off(), // SCD is shut down
        out: await tub.out(), // cooldown ended
        caged: await top.caged(),
        cooldown: await top.cooldown()
      };

      const pethInVaults = [];
      if (tubState.off && countCdps(checks['single-to-multi-cdp']) > 0) {
        const cdpService = maker.service('cdp');
        const ids = flatten(Object.values(checks['single-to-multi-cdp']));
        for (const id of ids) {
          const value = await cdpService.getCollateralValue(id);
          pethInVaults.push([id, PETH(value)]);
        }
      }

      setFetching(false);

      dispatch({
        type: 'assign',
        payload: {
          emergencyShutdownActive,
          cdpMigrationCheck: checks['single-to-multi-cdp'],
          saiBalance: SAI(checks['sai-to-dai']),
          oldMkrBalance: checks['mkr-redeemer'],
          chiefMigrationCheck: checks['chief-migrate'],
          tubState,
          pethInVaults
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
      daiDsrEndBalance,
      saiAvailable,
      daiAvailable,
      oldMkrBalance,
      chiefMigrationCheck,
      vaultsToRedeem,
      tubState = {},
      pethInVaults
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
    daiDsrEndBalance &&
    daiDsrEndBalance.gt(0) &&
    emergencyShutdownActive &&
    secondsUntilAuctionClose !== undefined &&
    systemDebt !== undefined &&
    fixedPrices !== undefined;
  const shouldShowRedeemVaults =
    vaultsToRedeem && vaultsToRedeem.claims.length > 0;

  console.log('tub state:', tubState);
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
              title="Redeem Old MKR"
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
              metadataValue={showAmount(daiDsrEndBalance)}
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
                  <Timer
                    seconds={secondsUntilAuctionClose}
                    prefix="Auctions in progress. Cooldown ends in"
                  >
                    Dai holders need to wait for the cooldown period to complete
                    because vaults have priority as their debt needs to be
                    cleared first. This will allow the correct amount of
                    underlying collateral to be calculated as part of your Dai
                    redemption.
                  </Timer>
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
            <SCDESCollateralCard {...{ tubState, pethInVaults }} />
          )}
          {shouldShowSCDESSai && (
            <MigrationCard
              title="Redeem SAI for collateral"
              onSelected={() => Router.push('/migration/scd-es-sai')}
              metadataTitle="SAI to Redeem"
              metadataValue={showAmount(saiBalance)}
            >
              <Text.p t="body">
                Redeem your Single-Collateral Dai (SAI) for a proportional
                amount of ETH from the Single-Collateral Dai system.
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

function SCDESCollateralCard({ tubState, pethInVaults }) {
  const { out, caged, cooldown } = tubState;
  const endTime = caged.toNumber() + cooldown.toNumber();
  const [seconds, setSeconds] = useState();
  const total = pethInVaults.reduce((sum, v) => sum.plus(v[1]), PETH(0));

  useEffect(() => {
    const val = endTime - new Date().getTime() / 1000;
    setSeconds(val);
    setTimeout(() => setSeconds(0), val * 1000);
  }, []);

  return (
    <MigrationCard
      title="Withdraw ETH from SAI CDP"
      metadataTitle="PETH in Vault(s)"
      metadataValue={showAmount(total)}
      onSelected={() => Router.push('/migration/scd-es-cdp')}
      disabled={!out}
    >
      <>
        <Text.p t="body">
          Redeem your ETH from your Single-Collateral Dai Vault(s) for a
          proportional amount of ETH from the system.
        </Text.p>
        {!out && (
          <TextBlock t="body" mt={'m'} color="#708390" fontWeight="500">
            {seconds > 0 ? (
              <Timer
                seconds={seconds}
                prefix="Sai redemption in progress. Cooldown period ends in"
              >
                CDP holders must wait for all outstanding debt to be removed in
                order to balance out the ETH:PETH ratio.
              </Timer>
            ) : (
              <>
                Cooldown period has ended and access will be granted soon.
                Reload the page to see.
              </>
            )}
          </TextBlock>
        )}
      </>
    </MigrationCard>
  );
}

export default OverviewDataFetch;
