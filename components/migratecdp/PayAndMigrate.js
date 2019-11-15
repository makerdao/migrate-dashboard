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
import { ErrorBlock } from '../Typography';

const APPROVAL_FUDGE = 2;

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
        <Link target="_blank" href="https://migrate.makerdao.com/terms">
          Terms of Service
        </Link>
        .
      </Text>
    </Grid>
  );
};

const MKRPurchaseWarning = () => {
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
      const errMsg = `unlock mkr tx failed ${err}`;
      console.error(errMsg);
      addToastWithTimeout(errMsg, dispatch);
    }
    setMkrApprovePending(false);
  }, [maker, proxyDetails, govFeeMKRExact]);

  const migrateCdp = async () => {
    try {
      const mig = await maker
        .service('migration')
        .getMigration('single-to-multi-cdp');
      const migrationTxObject = mig.execute(
        selectedCDP.id,
        undefined,
        undefined,
        undefined,
        {}
      );
      maker.service('transactionManager').listen(migrationTxObject, {
        pending: tx => setMigrationTxHash(tx.hash),
        error: () => showErrorMessageAndAllowExiting()
      });
      const newId = await migrationTxObject;
      setNewCdpId(newId);
      setCdps(cdps => cdps.filter(c => c !== selectedCDP));
      onNext();
    } catch (err) {
      const errMsg = `migrate tx failed ${err}`;
      console.error(errMsg);
      addToastWithTimeout(errMsg, dispatch);
      onPrev();
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

  const hasEnoughMkr = mkrBalance && mkrBalance.gt(govFeeMKRExact);

  const maxCost =
    parseFloat(selectedCDP.govFeeDai) +
    parseFloat(selectedCDP.govFeeDai) * 0.05;

  const minNewCollatRatio = selectedCDP.collateralValueExact
    .dividedBy(selectedCDP.debtValueExact.plus(maxCost))
    .times(100)
    .toNumber();

  const aboveOneSeventy = minNewCollatRatio > 170;

  return (
    <Grid
      maxWidth="912px"
      gridRowGap="l"
      px={['s', 0]}
      mx={[0, 'auto']}
      width={['100vw', 'auto']}
    >
      <Text.h2 textAlign="center">Confirm CDP Upgrade</Text.h2>
      <CardTabs headers={['Pay with MKR', 'Pay with CDP debt']}>
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
              or purchase enough MKR to pay the stability fee before continuing.
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
                    {prettifyNumber(maxCost, false, 4)}
                  </Text>
                </Table.td>
              </Table.tr>
              <Table.tr>
                <Table.td>
                  <Text>Current Col. Ratio</Text>
                </Table.td>
                <Table.td textAlign="right">
                  <Text fontWeight="medium">
                    {selectedCDP.collateralizationRatio} %
                  </Text>
                </Table.td>
              </Table.tr>
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
                    {prettifyNumber(minNewCollatRatio, false, 2, false)} %
                  </Text>
                </Table.td>
              </Table.tr>
            </Table.tbody>
          </Table>
          {!aboveOneSeventy ? (
            <ErrorBlock>
              You cannot use this feature because your CDP would end up with a
              collateralization ratio of less than 170%. Please use ‘Pay with
              MKR’ or repay some of your CDP debt before continuing.
            </ErrorBlock>
          ) : (
            <Fragment>
              {govFeeMKRExact.gt(100) && <MKRPurchaseWarning />}
              <TOSCheck {...{ hasReadTOS, setHasReadTOS }} />
            </Fragment>
          )}
        </Grid>
      </CardTabs>
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
          disabled={!hasReadTOS || !proxyDetails.hasMkrAllowance}
          onClick={() => {
            migrateCdp();
            onNext();
          }}
        >
          Pay and Migrate
        </Button>
      </Grid>
    </Grid>
  );
};

export default PayAndMigrate;
