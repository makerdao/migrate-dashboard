import React, { useState, useEffect } from 'react';
import {
  Text,
  Grid,
  Table,
  Button,
  Checkbox,
  Link,
  Overflow,
  Card
} from '@makerdao/ui-components-core';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import useMaker from '../../hooks/useMaker';
import useStore from '../../hooks/useStore';
import { addToastWithTimeout } from '../Toast';
import LoadingToggle from '../LoadingToggle';

const TableRow = ({
  vaultId,
  collateral,
  daiDebt,
  exchangeRate,
  vaultValue
}) => (
    <tr css="white-space: nowrap;">
      <td>{vaultId}</td>
      <td>{collateral}</td>
      <td>{daiDebt}</td>
      <td>{exchangeRate}</td>
      <td>{vaultValue}</td>
    </tr>
  );


const TOSCheck = ({ hasReadTOS, setHasReadTOS }) => {
  return (
    <Grid alignItems="center" gridTemplateColumns="auto 1fr">
      <Checkbox
        mr="s"
        fontSize="l"
        checked={hasReadTOS}
        onChange={() => setHasReadTOS(!hasReadTOS)}
        data-testid="tosCheck"
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

const RedeemVaults = ({
  onPrev,
  onNext,
  vaultData,
  setRedeemTxHash
}) => {
  const [hasReadTOS, setHasReadTOS] = useState(false);
  const [daiApprovePending, setDaiApprovePending] = useState(false);
  const [proxyDetails, setProxyDetails] = useState({});
  const [redeemInitiated, setRedeemInitiated] = useState(false);
  const [, dispatch] = useStore();
  const { maker, account } = useMaker();

  const giveProxyDaiAllowance = async () => {
    setDaiApprovePending(true);
    try {
      await maker
        .getToken(MDAI)
        .approveUnlimited();
      setProxyDetails(proxyDetails => console.log('proxyDetails', proxyDetails) || ({
        ...proxyDetails,
        hasDaiAllowance: true
      }));
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `unlock dai tx failed ${message}`;
      console.error(errMsg);
      addToastWithTimeout(errMsg, dispatch);
    }
    setDaiApprovePending(false);
  };

  const redeemVaults = async () => {
    try {
      setRedeemInitiated(true);
      //TODO use SDK method for redeem

      // const mig = maker
      //   .service('migration')
      //   .getMigration('single-to-multi-cdp');
      // const txObject = mig.execute(selectedCDP.id);
      // maker.service('transactionManager').listen(txObject, {
      //   pending: tx => {
      //     console.log('tx', tx);
      //     setRedeemTxHash(tx.hash);
      //     onNext();
      //   },
      //   error: () => showErrorMessageAndAllowExiting()
      // });
      const mockHash = '0x5179b053b1f0f810ba7a14f82562b389f06db4be6114ac6c40b2744dcf272d95';
      setRedeemTxHash(mockHash);
      onNext();
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `redeem vaults tx failed ${message}`;
      console.error(errMsg);
      addToastWithTimeout(errMsg, dispatch);
    }
  };

  useEffect(() => {
    (async () => {
      if (!maker || !account) return;
      maker
        .service('proxy')
        .currentProxy()
        .then(async address => {
          if (!address) return;
          const connectedWalletAllowance = await maker
            .getToken(MDAI)
            .allowance(account.address, address);
          //TODO fix this when we find out the correct parameter.
          const hasDaiAllowance = connectedWalletAllowance.gte(0);
          setProxyDetails({ hasDaiAllowance, address });
        });
    })();
  }, [account, maker]);

  const tableHeaders = ['Vault ID', 'Collateral', 'Dai Debt', 'Exchange Rate', 'Vault Value'];

  return (
    <Grid
      maxWidth="912px"
      gridRowGap="l"
      px={['s', 0]}
      mx={[0, 'auto']}
      width={['100vw', 'auto']}
    >
      <Text.h2 textAlign="center">Confirm Transaction</Text.h2>
      <Grid gridRowGap="m" color="darkPurple" pt="2xs" pb="l" px="l">
        <Card px="l" py="l">
          <Overflow x="scroll" y="visible">
            <Table
              width="100%"
              css={`
                  th,
                  td {
                    padding-right: 10px;
                  }
                `}
            >
              <thead>
                <tr css="white-space: nowrap;">
                  <th>{tableHeaders[0]}</th>
                  <th>{tableHeaders[1]}</th>
                  <th>{tableHeaders[2]}</th>
                  <th>{tableHeaders[3]}</th>
                  <th css="text-align: right">{tableHeaders[4]}</th>
                </tr>
              </thead>
              <tbody>
                {vaultData.map(
                  vault =>
                    (
                      <TableRow
                        key={vault.id}
                        vaultId={vault.id}
                        collateral={vault.collateral}
                        daiDebt={vault.daiDebt}
                        exchangeRate={vault.exchangeRate}
                        vaultValue={vault.vaultValue}
                      />
                    )
                )}
              </tbody>
            </Table>
          </Overflow>
          <Grid mt="m" gridRowGap="s">
            <LoadingToggle
              completeText={'DAI unlocked'}
              loadingText={'Unlocking DAI'}
              defaultText={'Unlock DAI to continue'}
              isLoading={daiApprovePending}
              isComplete={proxyDetails.hasDaiAllowance}
              onToggle={giveProxyDaiAllowance}
              disabled={
                proxyDetails.hasDaiAllowance || !proxyDetails.address
              }
              gridColumnGap="l"
              testId="allowance-toggle"
              reverse={true}
            />
            <TOSCheck {...{ hasReadTOS, setHasReadTOS }} />
          </Grid>
        </Card>
      </Grid>
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
            redeemInitiated || !hasReadTOS
          }
          onClick={redeemVaults}
        >
          Redeem
        </Button>
      </Grid>
    </Grid>
  );
};

export default RedeemVaults;
