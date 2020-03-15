import React, { useState } from 'react';
import {
  Text,
  Grid,
  Flex,
  Table,
  Button,
  Checkbox,
  Link,
  Card
} from '@makerdao/ui-components-core';
import useStore from '../../hooks/useStore';
import useMaker from '../../hooks/useMaker';
import { addToastWithTimeout } from '../Toast';

const TableRow = ({
  vaultId,
  collateral,
  daiDebt,
  exchangeRate,
  vaultValue,
  redeemInitiated,
  hasReadTOS,
  redeemVaults,
  vaultGem
}) => (
    <tr css="white-space: nowrap;">
      <td>{vaultId}</td>
      <td>{collateral}</td>
      <td>{daiDebt}</td>
      <td>{exchangeRate}</td>
      <td>{vaultValue}</td>
      <td>
        <Button
          px="16px"
          py="4px"
          justifySelf="center"
          disabled={
            redeemInitiated || !hasReadTOS
          }
          onClick={() => redeemVaults(vaultId, vaultGem)}><Text t="small">Redeem</Text></Button></td>
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
  // onPrev,
  // onNext,
  vaultData,
  setRedeemTxHash,
  showErrorMessageAndAllowExiting
}) => {
  const { maker } = useMaker();
  const [hasReadTOS, setHasReadTOS] = useState(false);
  const [redeemInitiated, setRedeemInitiated] = useState(false);
  const [, dispatch] = useStore();

  const redeemVaults = async (vaultId, vaultGem) => {
    try {
      setRedeemInitiated(true);
      const mig = maker
        .service('migration')
        .getMigration('global-settlement-collateral-claims');
      //check vaultGem here to select free function.
      const txObject = mig.freeEth(vaultId);
      maker.service('transactionManager').listen(txObject, {
        pending: tx => {
          console.log('tx', tx);
          setRedeemTxHash(tx.hash);
          // onNext();
        },
        error: () => showErrorMessageAndAllowExiting()
      });
      const mockHash = '0x5179b053b1f0f810ba7a14f82562b389f06db4be6114ac6c40b2744dcf272d95';
      setRedeemTxHash(mockHash);
      // onNext();
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `redeem vaults tx failed ${message}`;
      console.error(errMsg);
      addToastWithTimeout(errMsg, dispatch);
    }
  };

  const tableHeaders = ['Vault ID', 'Collateral', 'Dai Debt', 'Exchange Rate', 'Vault Value', 'Action'];

  return (
    <Grid
      maxWidth="912px"
      gridRowGap="l"
      px={['s', 0]}
      mx={[0, 'auto']}
      width={['100vw', 'auto']}
    >
      <Grid gridRowGap="s">
        <Text.h2 textAlign="center">Redeem Excess Collateral from Vaults</Text.h2>
        <Grid gridRowGap="xs">
          <Text.p fontSize="1.7rem" color="darkLavender" textAlign="center">
            Unlock and redeem Excess Collateral from your Vaults.
      </Text.p>
          {/* <Text.p fontSize="1.7rem" color="darkLavender" textAlign="center">
            Each vault requires two transactions.
      </Text.p> */}
        </Grid>
      </Grid>
      <Grid gridRowGap="m" color="darkPurple" pt="2xs" pb="l" px="l">
        <Card px="l" py="l">
          <Table
            width="100%"
            css={`
                  th,
                  td {
                    padding-right: 10px;
                  }
                  tr:last-child {
                    margin-bottom: 10px;
                  }
                `}
          >
            <thead>
              <tr css="white-space: nowrap;">
                <th>{tableHeaders[0]}</th>
                <th>{tableHeaders[1]}</th>
                <th>{tableHeaders[2]}</th>
                <th>{tableHeaders[3]}</th>
                <th>{tableHeaders[4]}</th>
                <th>{tableHeaders[5]}</th>
              </tr>
            </thead>
            <tbody>
              {vaultData.map(
                vault =>
                  (
                    <TableRow
                      key={vault.id}
                      vaultId={vault.toNumber()}
                      collateral={vault.collateral}
                      daiDebt={vault.daiDebt}
                      exchangeRate={vault.exchangeRate}
                      vaultValue={vault.vaultValue}
                      redeemInitiated={redeemInitiated}
                      hasReadTOS={hasReadTOS}
                      redeemVaults={redeemVaults}
                    // vaultGem={vault.gem}
                    />
                  )
              )}
            </tbody>
          </Table>
          <Flex mt="m">
            <TOSCheck {...{ hasReadTOS, setHasReadTOS }} />
          </Flex>
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
        // onClick={onPrev}
        >
          Back to Migrate
        </Button>
      </Grid>
    </Grid>
  );
};

export default RedeemVaults;
