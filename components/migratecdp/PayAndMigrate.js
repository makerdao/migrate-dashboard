import React, { Fragment, useState, useEffect, useCallback } from 'react';
import {
  Text,
  Grid,
  Table,
  Button,
  Checkbox,
  Link,
  CardTabs,
  Card
} from '@makerdao/ui-components-core';
import { MKR } from '@makerdao/dai-plugin-mcd';
import { prettifyNumber } from '../../utils/ui';
import useMaker from '../../hooks/useMaker';
import useStore from '../../hooks/useStore';
import { addToastWithTimeout } from '../Toast';
import LoadingToggle from '../LoadingToggle';
import round from 'lodash/round';
import ceil from 'lodash/ceil';
import { ErrorBlock } from '../Typography';

const APPROVAL_FUDGE = 2;
const HIGH_FEE_LOWER_BOUND = 50;
const CDP_MIN_RATIO = 170;

const TOSCheck = ({ hasReadTOS, setHasReadTOS }) => {
  return (
    <Grid alignItems="center" gridTemplateColumns="auto 1fr">
      <Checkbox
        mr="s"
        fontSize="l"
        checked={hasReadTOS}
        onChange={() => setHasReadTOS(!hasReadTOS)}
      />
      <Text
        t="caption"
        color="steel"
        onClick={() => setHasReadTOS(!hasReadTOS)}
      >
        I have read and accept the{' '}
        <Link target="_blank" href="/terms">
          Terms of Service
        </Link>
        .
      </Text>
    </Grid>
  );
};

const PurchaseWarning = () => {
  const safeA = (href, text) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {text || href.replace(/^https:\/\/(www\.)?/, '')}
    </a>
  );

  return (
    <Card bg="yellow.100" p="m" borderColor="yellow.400" border="1px solid">
      This portal will purchase MKR through{' '}
      {safeA('https://oasis.app', 'Oasis.app')}; additionally, users should feel
      free to explore services such as {safeA('https://1inch.exchange')},{' '}
      {safeA('https://www.totle.com')}, {safeA('https://dexindex.io')}, or{' '}
      {safeA('https://dex.ag')}. You agree that you use Oasis, or any other
      service, at your own risk. Oasis is a decentralized exchange that does not
      hold custody of your funds and cannot reverse transactions once you
      execute them.
    </Card>
  );
};

const PayAndMigrate = ({
  onPrev,
  onNext,
  selectedCDP,
  setMigrationTxHash,
  setCdps,
  setNewCdpId,
  showErrorMessageAndAllowExiting
}) => {
  const [hasReadTOS, setHasReadTOS] = useState(false);
  const [mkrApprovePending, setMkrApprovePending] = useState(false);
  const [proxyDetails, setProxyDetails] = useState({});
  const [mkrBalance, setMkrBalance] = useState(false);
  const [, dispatch] = useStore();
  const { maker, account } = useMaker();
  const { govFeeMKRExact } = selectedCDP;

  const maxCost = selectedCDP.govFeeDaiExact.plus(
    selectedCDP.govFeeDaiExact.times(0.05)
  );

  const newCollatRatio = selectedCDP.collateralValueExact
    .dividedBy(selectedCDP.debtValueExact.plus(maxCost.toNumber()))
    .times(100)
    .toNumber();

  const giveProxyMkrAllowance = useCallback(async () => {
    setMkrApprovePending(true);
    try {
      await maker
        .getToken(MKR)
        .approve(proxyDetails.address, govFeeMKRExact.times(APPROVAL_FUDGE));
      setProxyDetails(proxyDetails => ({
        ...proxyDetails,
        hasMkrAllowance: true
      }));
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `unlock mkr tx failed ${message}`;
      console.error(errMsg);
      addToastWithTimeout(errMsg, dispatch);
    }
    setMkrApprovePending(false);
  }, [maker, proxyDetails, govFeeMKRExact]);

  const migrateCdpPayWithMkr = async () => {
    try {
      const mig = maker
        .service('migration')
        .getMigration('single-to-multi-cdp');
      const migrationTxObject = mig.execute(selectedCDP.id);
      maker.service('transactionManager').listen(migrationTxObject, {
        pending: tx => {
          setMigrationTxHash(tx.hash);
          onNext();
        },
        error: () => showErrorMessageAndAllowExiting()
      });
      const newId = await migrationTxObject;
      setNewCdpId(newId);
      setCdps(cdps => cdps.filter(c => c !== selectedCDP));
      onNext();
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `migrate tx failed ${message}`;
      console.error(errMsg);
      addToastWithTimeout(errMsg, dispatch);
    }
  };

  const migrateCdpPayWithDebt = async () => {
    try {
      const mig = maker
        .service('migration')
        .getMigration('single-to-multi-cdp');
      const migrationTxObject = mig.execute(
        selectedCDP.id,
        'DEBT',
        maxCost,
        CDP_MIN_RATIO
      );
      maker.service('transactionManager').listen(migrationTxObject, {
        pending: tx => {
          setMigrationTxHash(tx.hash);
          onNext();
        },
        error: () => showErrorMessageAndAllowExiting()
      });
      const newId = await migrationTxObject;
      setNewCdpId(newId);
      setCdps(cdps => cdps.filter(c => c !== selectedCDP));
      onNext();
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `migrate tx failed ${message}`;
      console.error(errMsg);
      addToastWithTimeout(errMsg, dispatch);
    }
  };

  useEffect(() => {
    (async () => {
      if (maker && account) {
        const mkrToken = maker.service('token').getToken(MKR);
        const [mkrBalanceFromSdk, proxyAddress] = await Promise.all([
          mkrToken.balance(),
          maker.service('proxy').currentProxy()
        ]);
        setMkrBalance(mkrBalanceFromSdk);
        if (proxyAddress) {
          const connectedWalletAllowance = await maker
            .getToken(MKR)
            .allowance(account.address, proxyAddress);
          const hasMkrAllowance = connectedWalletAllowance.gte(
            govFeeMKRExact.times(APPROVAL_FUDGE)
          );
          setProxyDetails({ hasMkrAllowance, address: proxyAddress });
        }
      }
    })();
  }, [account, maker, govFeeMKRExact]);

  let hasEnoughMkr=null;
  let mkrNeeded=null;
  if(mkrBalance){
    hasEnoughMkr = mkrBalance.gt(govFeeMKRExact);
    const mkrNeededExact = govFeeMKRExact.minus(mkrBalance);
    mkrNeeded = mkrNeededExact.gt(0.01) ?
      prettifyNumber(ceil(mkrNeededExact.toNumber(),2)) : ceil(mkrNeededExact.toNumber(), 6);
  }
  const aboveOneSeventy = newCollatRatio > 170;

  const TAB_PAY_WITH_MKR = 0;
  const TAB_PAY_WITH_DEBT = 1;
  const TABS = ['Pay with MKR', 'Pay with CDP debt'];
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <Grid
      maxWidth="912px"
      gridRowGap="l"
      px={['s', 0]}
      mx={[0, 'auto']}
      width={['100vw', 'auto']}
    >
      <Text.h2 textAlign="center">Confirm CDP Upgrade</Text.h2>
      <CardTabs onChange={setSelectedTab} headers={TABS}>
        <Grid gridRowGap="m" color="darkPurple" pt="2xs" pb="l" px="l">
          <Table width="100%">
            <Table.tbody>
              <Table.tr>
                <Table.td>
                  <Text>CDP ID</Text>
                </Table.td>
                <Table.td textAlign="right">
                  <Text fontWeight="medium">
                    <Link>{selectedCDP.id}</Link>
                  </Text>
                </Table.td>
              </Table.tr>
              <Table.tr>
                <Table.td>
                  <Text>Stability Fee</Text>
                </Table.td>
                <Table.td textAlign="right">
                  <Text fontWeight="medium">{selectedCDP.govFeeMKR} MKR</Text>
                </Table.td>
              </Table.tr>
              <Table.tr>
                <Table.td>
                  <Text color={mkrBalance && !hasEnoughMkr ? '#D85B19' : null}>
                    MKR Balance
                  </Text>
                </Table.td>
                <Table.td textAlign="right">
                  <Text
                    color={mkrBalance && !hasEnoughMkr ? '#D85B19' : null}
                    fontWeight="medium"
                  >
                    {mkrBalance
                      ? mkrBalance.toNumber() > 0.01
                        ? prettifyNumber(mkrBalance, false, 2, false)
                        : round(mkrBalance.toNumber(), 6)
                      : '...'}{' '}
                    MKR
                  </Text>
                </Table.td>
              </Table.tr>
            </Table.tbody>
          </Table>
          {mkrBalance && !hasEnoughMkr ? (
            <ErrorBlock>
              You have insufficient MKR balance. Please use `Pay with CDP debt`,
              or purchase {mkrNeeded ? `at least ${mkrNeeded}` : 'enough'} MKR to pay the stability fee before continuing.
            </ErrorBlock>
          ) : (
            mkrBalance && (
              <div>
                <Grid mb="m">
                  <LoadingToggle
                    completeText={'MKR unlocked'}
                    loadingText={'Unlocking MKR'}
                    defaultText={'Unlock MKR to continue'}
                    tokenDisplayName={'MKR'}
                    isLoading={mkrApprovePending}
                    isComplete={proxyDetails.hasMkrAllowance}
                    onToggle={giveProxyMkrAllowance}
                    disabled={
                      proxyDetails.hasMkrAllowance || !proxyDetails.address
                    }
                    data-testid="allowance-toggle"
                  />
                </Grid>
                <TOSCheck {...{ hasReadTOS, setHasReadTOS }} />
              </div>
            )
          )}
        </Grid>
        <Grid gridRowGap="m" color="darkPurple" pt="2xs" pb="l" px="l">
          <Table width="100%">
            <Table.tbody>
              <Table.tr>
                <Table.td>
                  <Text>CDP ID</Text>
                </Table.td>
                <Table.td textAlign="right">
                  <Text fontWeight="medium">
                    <Link>{selectedCDP.id}</Link>
                  </Text>
                </Table.td>
              </Table.tr>
              <Table.tr>
                <Table.td>
                  <Text>Stability Fee</Text>
                </Table.td>
                <Table.td textAlign="right">
                  <Text fontWeight="medium">
                    {selectedCDP.govFeeMKR} MKR ({selectedCDP.govFeeDai} DAI)
                  </Text>
                </Table.td>
              </Table.tr>
              <Table.tr>
                <Table.td>
                  <Text>Max Cost (5% Slippage)</Text>
                </Table.td>
                <Table.td textAlign="right">
                  <Text fontWeight="medium">
                    {prettifyNumber(maxCost.toNumber(), false, 4, false)} DAI
                  </Text>
                </Table.td>
              </Table.tr>
              <Table.tr>
                <Table.td>
                  <Text>Current Col. Ratio</Text>
                </Table.td>
                <Table.td textAlign="right">
                  <Text fontWeight="medium">
                    {selectedCDP.collateralizationRatio}%
                  </Text>
                </Table.td>
              </Table.tr>
              {aboveOneSeventy ? (
                <Table.tr>
                  <Table.td>
                    <Text color={!aboveOneSeventy ? '#D85B19' : null}>
                      Min New Col. Ratio
                    </Text>
                  </Table.td>
                  <Table.td textAlign="right">
                    <Text
                      color={!aboveOneSeventy ? '#D85B19' : null}
                      fontWeight="medium"
                    >
                      {prettifyNumber(newCollatRatio, false, 2, false)}%
                    </Text>
                  </Table.td>
                </Table.tr>
              ) : null}
            </Table.tbody>
          </Table>
          {aboveOneSeventy ? (
            <TOSCheck {...{ hasReadTOS, setHasReadTOS }} />
          ) : (
            <ErrorBlock>
              You cannot use this feature because your CDP would end up with a
              collateralization ratio of less than {CDP_MIN_RATIO}%. Please use
              ‘Pay with MKR’ or repay some of your CDP debt before continuing.
            </ErrorBlock>
          )}
        </Grid>
      </CardTabs>
      {selectedTab === 1 && govFeeMKRExact.gt(HIGH_FEE_LOWER_BOUND) && (
        <PurchaseWarning />
      )}
      <Grid
        gridTemplateColumns="auto auto"
        justifyContent="center"
        gridColumnGap="m"
      >
        <Button
          justifySelf="center"
          variant="secondary-outline"
          onClick={onPrev}
        >
          Back
        </Button>
        <Button
          justifySelf="center"
          disabled={
            !hasReadTOS ||
            (selectedTab === TAB_PAY_WITH_MKR &&
              !proxyDetails.hasMkrAllowance) ||
            (selectedTab === TAB_PAY_WITH_DEBT && !aboveOneSeventy)
          }
          onClick={() => {
            if (selectedTab === TAB_PAY_WITH_MKR) {
              migrateCdpPayWithMkr();
            } else if (selectedTab === TAB_PAY_WITH_DEBT) {
              migrateCdpPayWithDebt();
            }
          }}
        >
          Pay and Migrate
        </Button>
      </Grid>
    </Grid>
  );
};

export default PayAndMigrate;
