  import React, { useState, useEffect } from 'react';
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

  export default ({
    onNext,
    onPrev,
    setMigrationTxHash,
    showErrorMessageAndAllowExiting
  }) => {
    const { maker, account } = useMaker();
    const [hasReadTOS, setHasReadTOS] = useState(false);
    const [saiApprovePending, setSaiApprovePending] = useState(false);
    const [redemptionInitiated, setRedemptionInitiated] = useState(false);
    const [proxyDetails, setProxyDetails] = useState({});
    const [{ redeemedCollateral, pethEthRatio, totalPeth }, dispatch] = useStore();
    const migrationContractAddress = maker
      .service('smartContract')
      .getContract('MIGRATION').address;

    // Account Unlock
    // const giveProxySaiAllowance = async () => {
    //   setSaiApprovePending(true);
    //   try {
    //     await maker
    //       .getToken('SAI')
    //       .approveUnlimited(migrationContractAddress);
    //     setProxyDetails(proxyDetails => ({
    //       ...proxyDetails,
    //       hasSaiAllowance: true
    //     }));
    //   } catch (err) {
    //     const message = err.message ? err.message : err;
    //     const errMsg = `unlock sai tx failed ${message}`;
    //     console.error(errMsg);
    //     addToastWithTimeout(errMsg, dispatch);
    //   }
    //   setSaiApprovePending(false);
    // };
    
    // Contract Call
    const redeemSai = async () => {
      // try {
      //   setRedemptionInitiated(true);
        // const mig = await maker.service('migration').getMigration('dai-to-sai');
      //   const migrationTxObject = mig.execute(daiAmountToMigrate);
      //   maker.service('transactionManager').listen(migrationTxObject, {
      //     pending: tx => {
      //       setMigrationTxHash(tx.hash);
      //       onNext();
      //     },
      //     error: () => showErrorMessageAndAllowExiting()
      //   });
      //   migrationTxObject.then(onNext);
      // } catch (err) {
      //   const message = err.message ? err.message : err;
      //   const errMsg = `migrate tx failed ${message}`;
      //   console.error(errMsg);
      //   addToastWithTimeout(errMsg, dispatch);
      // }
    };

    // Allowance Check
    useEffect(() => {
      (async () => {
        if (maker && account) {
          const connectedWalletAllowance = await maker
            .getToken('SAI')
            .allowance(account.address, migrationContractAddress);
          const hasSaiAllowance = connectedWalletAllowance.gte(
            daiAmountToMigrate.toBigNumber().times(1.05)
          );
          setProxyDetails({ hasSaiAllowance });
        }
      })();
    }, [account, maker, daiAmountToMigrate]);

    const amount = prettifyNumber(daiAmountToMigrate.toNumber());

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
              gridTemplateColumns{'auto' 'auto'}}
            >
              <Table p={0}>
                <Table.tbody>
                  <Table.tr>
                    <Table.td>
                      <Text display={'block'}></Text>
                      <Text
                        t="heading"
                        display={'block'}
                        fontWeight="bold"
                      >{`${amount} Multi-Collateral Dai`}</Text>
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
                      >{`${amount} Single-Collateral Sai`}</Text>
                    </Table.td>
                  </Table.tr>
                </Table.tbody>
              </Table>
            </Grid>
          </Card>
          <Card>
            <Grid px={'m'} py={'m'}>
              <LoadingToggle
                completeText={'DAI unlocked'}
                loadingText={'Unlocking DAI'}
                defaultText={'Unlock DAI to continue'}
                tokenDisplayName={'DAI'}
                isLoading={saiApprovePending}
                isComplete={proxyDetails.hasSaiAllowance}
                onToggle={giveProxySaiAllowance}
                disabled={proxyDetails.hasSaiAllowance}
                testId="allowance-toggle"
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
                data-testid="terms"
                onClick={() => setHasReadTOS(!hasReadTOS)}
              >
                I have read and accept the{' '}
                <Link target="_blank" href="/terms">
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
            disabled={!hasReadTOS || !proxyDetails.hasSaiAllowance || redemptionInitiated}
            onClick={redeemSai}
          >
            Continue
          </Button>
        </Grid>
      </Grid>
    );
  };
