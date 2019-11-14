import React, { useState, useCallback, useEffect } from 'react';
import {
  Text,
  Button,
  Grid,
  Table,
  Link,
  Card,
  Checkbox
} from '@makerdao/ui-components-core';
import useStore from '../../hooks/useStore';
import useMaker from '../../hooks/useMaker';
import LoadingToggle from '../LoadingToggle';
import { addToastWithTimeout } from '../Toast';
import { prettifyNumber } from '../../utils/ui';

export default ({ onNext, onPrev, setMigrationTxHash, showErrorMessageAndAllowExiting }) => {
  const { maker, account } = useMaker();
  const [hasReadTOS, setHasReadTOS] = useState(false);
  const [saiApprovePending, setSaiApprovePending] = useState(false);
  const [proxyDetails, setProxyDetails] = useState({});
  const [{ saiAmountToMigrate }] = useStore();

  const giveProxySaiAllowance = useCallback(async () => {
    setSaiApprovePending(true);
    try {
      await maker
        .getToken('SAI')
        .approve(proxyDetails.address, saiAmountToMigrate);
      setProxyDetails(proxyDetails => ({
        ...proxyDetails,
        hasSaiAllowance: true
      }));
    } catch (err) {
      const errMsg = `unlock sai tx failed ${err}`;
      console.error(errMsg);
      addToastWithTimeout(errMsg, dispatch);
    }
    setSaiApprovePending(false);
  }, [maker, proxyDetails, saiAmountToMigrate]);

  const upgradeSai = useCallback(async () => {
    try {
      const mig = await maker.service('migration').getMigration('sai-to-dai');
      const migrationTxObject = mig.execute(saiAmountToMigrate);
      maker.service('transactionManager').listen(migrationTxObject, {
        pending: tx => setMigrationTxHash(tx.hash),
        error: () => showErrorMessageAndAllowExiting()
      });
      migrationTxObject.then(onNext);
    } catch (err) {
      const errMsg = `migrate tx failed ${err}`;
      console.error(errMsg);
      addToastWithTimeout(errMsg, dispatch);
      onPrev();
    }
  }, [maker, onNext, saiAmountToMigrate, setMigrationTxHash]);

  useEffect(() => {
    (async () => {
      if (maker && account) {
        // assuming they have a proxy
        const proxyAddress = await maker.service('proxy').currentProxy();
        if (proxyAddress) {
          const connectedWalletAllowance = await maker
            .getToken('SAI')
            .allowance(account.address, proxyAddress);
          const hasSaiAllowance = connectedWalletAllowance.gte(
            saiAmountToMigrate
          );
          setProxyDetails({ hasSaiAllowance, address: proxyAddress });
        }
      }
    })();
  }, [account, maker, saiAmountToMigrate]);

  const amount = prettifyNumber(saiAmountToMigrate);

  return (
    <Grid maxWidth="600px" gridRowGap="m" px={['s', 0]} minWidth="38rem">
      <Text.h2 textAlign="center" m="s">
        Confirm Transaction
      </Text.h2>
      <Grid gridRowGap="s">
        <Card>
          <Grid
            gridRowGap="s"
            color="darkPurple"
            px={{ s: 'm' }}
            py={{ s: 'xs' }}
          >
            <Table p={0}>
              <Table.tbody>
                <Table.tr>
                  <Table.td>
                    <Text display={'block'}>Sending</Text>
                    <Text
                      t="heading"
                      display={'block'}
                      fontWeight="bold"
                    >{`${amount} Single Collateral Dai`}</Text>
                  </Table.td>
                </Table.tr>
                <Table.tr>
                  <Table.td>
                    <Text display={'block'}>Exchange Rate</Text>
                    <Text t="heading" display={'block'} fontWeight="bold">
                      1:1
                    </Text>
                  </Table.td>
                </Table.tr>
                <Table.tr>
                  <Table.td>
                    <Text display={'block'}>Receiving</Text>
                    <Text
                      t="heading"
                      display={'block'}
                      fontWeight="bold"
                    >{`${amount} Multi Collateral Dai`}</Text>
                  </Table.td>
                </Table.tr>
              </Table.tbody>
            </Table>
          </Grid>
        </Card>
        <Card>
          <Grid px={'m'} py={'m'}>
            <LoadingToggle
              completeText={'SAI unlocked'}
              loadingText={'Unlocking SAI'}
              defaultText={'Unlock SAI to continue'}
              tokenDisplayName={'SAI'}
              isLoading={saiApprovePending}
              isComplete={proxyDetails.hasSaiAllowance}
              onToggle={giveProxySaiAllowance}
              disabled={proxyDetails.hasSaiAllowance || !proxyDetails.address}
              data-testid="allowance-toggle"
            />
          </Grid>
        </Card>
        <Card>
          <Grid
            alignItems="center"
            gridTemplateColumns="auto 1fr"
            px={'m'}
            py={'m'}
          >
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
        </Card>
      </Grid>
      <Grid
        justifySelf="center"
        justifyContent="center"
        gridTemplateColumns="auto auto"
        gridColumnGap="m"
      >
        <Button variant="secondary-outline" onClick={onPrev}>
          Back
        </Button>
        <Button
          disabled={!hasReadTOS || !proxyDetails.hasSaiAllowance}
          onClick={() => {
            upgradeSai();
            onNext();
          }}
        >
          Continue
        </Button>
      </Grid>
    </Grid>
  );
};
