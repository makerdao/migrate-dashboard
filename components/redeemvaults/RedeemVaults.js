import React, { useState } from 'react';
import {
  Text,
  Grid,
  Table,
  Button,
  Checkbox,
  Link,
  Card,
  Tooltip
} from '@makerdao/ui-components-core';
import TooltipContents from '../TooltipContents';
import useStore from '../../hooks/useStore';
import useMaker from '../../hooks/useMaker';
import { addToastWithTimeout } from '../Toast';
import SuccessButton from '../SuccessButton';

const TableRow = ({
  vaultId,
  type,
  redeemInitiated,
  redeemDone,
  hasReadTOS,
  redeemVaults,
  shutdownValue,
  vaultValue
}) => (
  <tr css="white-space: nowrap;">
    <td>{vaultId}</td>
    <td>{type}</td>
    {/* <td>{collateral}</td> */}
    {/* <td>{daiDebt}</td> */}
    <td>{shutdownValue}</td>
    <td>{vaultValue}</td>
    <td>
      {redeemDone.includes(vaultId) ? (
        <SuccessButton px="0px" py="4px" width="90px" justifySelf="center" />
      ) : (
        <Button
          px="0px"
          py="4px"
          width="90px"
          justifySelf="center"
          fontSize={'13px'}
          loading={
            redeemInitiated.includes(vaultId) && !redeemDone.includes(vaultId)
          }
          disabled={!hasReadTOS}
          onClick={() => redeemVaults(vaultId, type)}
        >
          Withdraw
        </Button>
      )}
    </td>
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
  vaultsToRedeem,
  setRedeemTxHash,
  onClose
}) => {
  const { maker } = useMaker();
  const [hasReadTOS, setHasReadTOS] = useState(false);
  const [redeemInitiated, setRedeemInitiated] = useState([]);
  const [redeemDone, setRedeemDone] = useState([]);

  const [, dispatch] = useStore();

  if (!maker) return null;

  const redeemVaults = async (vaultId, type) => {
    try {
      let txObject = null;
      setRedeemInitiated(redeemInitiated => [...redeemInitiated, vaultId]);
      const mig = maker
        .service('migration')
        .getMigration('global-settlement-collateral-claims');

      if (type === 'BAT') {
        txObject = mig.freeBat(vaultId);
      }
      if (type === 'ETH') {
        txObject = mig.freeEth(vaultId);
      }
      if (type === 'USDC') {
        txObject = mig.freeUsdc(vaultId);
      }

      await txObject;
      setRedeemDone(redeemDone => [...redeemDone, vaultId]);
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `redeem vaults tx failed ${message}`;
      console.error(errMsg);
      addToastWithTimeout(errMsg, dispatch);
      setRedeemInitiated(redeemInitiated => redeemInitiated.filter(v => v !== vaultId));
    }
  };

  const tableHeaders = [
    'Vault ID',
    'Vault Type',
    'Collateral',
    'Dai Debt',
    'Shutdown Value',
    'Available',
    'Action'
  ];

  return (
    <Grid
      maxWidth="912px"
      gridRowGap="l"
      px={['s', 0]}
      mx={[0, 'auto']}
      width={['100vw', 'auto']}
    >
      <Grid gridRowGap="s">
        <Text.h2 textAlign="center">
          Withdraw Excess Collateral from Vaults
        </Text.h2>
        <Grid gridRowGap="xs">
          <Text.p fontSize="1.7rem" color="darkLavender" textAlign="center">
            Withdraw excess collateral from your Multi-Collateral Dai Vaults.
          </Text.p>
        </Grid>
      </Grid>
      <Grid gridRowGap="m" color="darkPurple" pt="2xs" pb="l" px="l">
        <Card px={'m'} py={'m'}>
          <TOSCheck {...{ hasReadTOS, setHasReadTOS }} />
        </Card>
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
                {/* <th>{tableHeaders[2]}</th> */}
                {/* <th>{tableHeaders[3]}</th> */}
                <th>{tableHeaders[4]}</th>
                <th>
                  {tableHeaders[5]}
                  <Tooltip
                    color="steel"
                    fontSize="m"
                    ml="2xs"
                    content={
                      <TooltipContents>
                        Amount of collateral available after cancelling out your
                        Dai debt with collateral priced at the shutdown value
                      </TooltipContents>
                    }
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {vaultsToRedeem &&
                vaultsToRedeem.parsedVaultsData.map(vault => (
                  <TableRow
                    key={vault.id}
                    vaultId={vault.id}
                    collateral={vault.collateral}
                    type={vault.type}
                    daiDebt={vault.daiDebt}
                    shutdownValue={vault.shutdownValue}
                    vaultValue={vault.vaultValue}
                    redeemInitiated={redeemInitiated}
                    redeemDone={redeemDone}
                    hasReadTOS={hasReadTOS}
                    redeemVaults={redeemVaults}
                  />
                ))}
            </tbody>
          </Table>
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
          onClick={onClose}
        >
          Back to Migrate
        </Button>
      </Grid>
    </Grid>
  );
};

export default RedeemVaults;
