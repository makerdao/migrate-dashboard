import React, { useState, useEffect, useCallback } from 'react';
import {
  Text,
  Grid,
  Table,
  Button,
  Checkbox,
  Link,
  CardTabs
} from '@makerdao/ui-components-core';
import { MKR } from '@makerdao/dai-plugin-mcd';
import useMaker from '../../hooks/useMaker';
import LoadingToggle from '../LoadingToggle';

const APPROVAL_FUDGE = 2;

const PayAndMigrate = ({
  onPrev,
  onNext,
  selectedCDP,
  setMigrationTxObject
}) => {
  const [hasReadTOS, setHasReadTOS] = useState(false);
  const [mkrApprovePending, setMkrApprovePending] = useState(false);
  const [proxyDetails, setProxyDetails] = useState({});
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
      console.log('unlock mkr tx failed', err);
    }
    setMkrApprovePending(false);
  }, [maker, proxyDetails, govFeeMKRExact]);

  const migrateCdp = useCallback(async () => {
    try {
      const mig = await maker
        .service('migration')
        .getMigration('single-to-multi-cdp');
      const migrationTxObject = mig.execute(selectedCDP.id);
      setMigrationTxObject(migrationTxObject);
      await migrationTxObject;
    } catch (err) {
      console.log('migrate tx failed', err);
    }
  }, [account, maker, selectedCDP]);

  useEffect(() => {
    (async () => {
      if (maker && account) {
        // assuming they have a proxy
        const proxyAddress = await maker.service('proxy').currentProxy();
        if (proxyAddress){
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

  return (
    <Grid maxWidth="912px" gridRowGap="l">
      <Text.h2 textAlign="center">Confirm CDP Migration</Text.h2>
      <CardTabs headers={['Pay with MKR']}>
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
            </Table.tbody>
          </Table>
          <Grid>
            <LoadingToggle
              completeText={'MKR unlocked'}
              loadingText={'Unlocking MKR'}
              defaultText={'Unlock MKR to continue'}
              tokenDisplayName={'MKR'}
              isLoading={mkrApprovePending}
              isComplete={proxyDetails.hasMkrAllowance}
              onToggle={giveProxyMkrAllowance}
              disabled={proxyDetails.hasMkrAllowance}
              data-testid="allowance-toggle"
            />
          </Grid>
          <Grid alignItems="center" gridTemplateColumns="auto 1fr">
            <Checkbox
              mr="s"
              fontSize="l"
              checked={hasReadTOS}
              onChange={evt => setHasReadTOS(evt.target.checked)}
            />
            <Text t="caption" color="steel">
              I have read and accept the <Link>Terms of Service</Link>.
            </Text>
          </Grid>
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
          Cancel
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
