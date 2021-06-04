import React, { useState } from 'react';
import {
  Text,
  Grid,
  Button,
  Flex,
  Box,
  Card,
  Tooltip
} from '@makerdao/ui-components-core';
import { getColor } from '../../utils/theme';
import styled from 'styled-components';
import TooltipContents from '../TooltipContents';
import useStore from '../../hooks/useStore';
import useMaker from '../../hooks/useMaker';
import { addToastWithTimeout } from '../Toast';
import SuccessButton from '../SuccessButton';
import { TOSCheck } from '../migratecdp/PayAndMigrate';

const TABLE_COLUMNS = '1fr 2fr 2fr 2fr 2fr 2fr 2fr';

const Label = styled(Box)`
  text-transform: uppercase;
  font-weight: bold;
  font-size: 13px;
  color: ${getColor('steel')};
`;

function ListItemRow({ label, children, dark }) {
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      bg={dark ? getColor('lightGrey') : 'white'}
      px="m"
      py="s"
    >
      <Label>{label}</Label>
      <div>{children}</div>
    </Flex>
  );
}

function ListItem({
    vaultId,
    type,
    ilk,
    redeemInitiated,
    redeemDone,
    hasReadTOS,
    redeemVaults,
    collateral,
    daiDebt,
    shutdownValue,
    vaultValue,
    ...otherProps
  }) {
  const redeemButton = redeemDone.includes(vaultId) ? (
    <SuccessButton px="0px" py="4px" width="90px" justifySelf="center"
      data-testid={`successButton-${ilk}`}/>
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
      onClick={() => redeemVaults(vaultId, ilk)}
      data-testid={`withdrawButton-${ilk}`}
    >
      Withdraw
    </Button>
  );
  return (
    <Card
      px={['0', 'l']}
      py={['0', 'm']}
      mt={{s: 'm', l: 'xs'}}
      borderColor={'#D4D9E1'}
      border={'1px solid'}
      {...otherProps}
    >
      <Box display={['none', 'block']}>
        <Grid
          gridTemplateColumns={TABLE_COLUMNS}
          gridColumnGap="l"
          alignItems="center"
          fontSize="m"
          color="darkPurple"
          css="white-space: nowrap;"
        >
          <span>{vaultId}</span>
          <span>{type}</span>
          <span>{shutdownValue}</span>
          <span>{collateral}</span>
          <span>{daiDebt}</span>
          <span>{vaultValue}</span>
          {redeemButton}
        </Grid>
      </Box>
      <Box display={['block', 'none']}>
        <ListItemRow label="Token" dark>
          {vaultId}
        </ListItemRow>
        <ListItemRow label="Value">
          {type}
        </ListItemRow>
        <ListItemRow label="Exchange Rate" dark>
          {shutdownValue}
        </ListItemRow>
        <ListItemRow label="Redeeming">
          {collateral}
        </ListItemRow>
        <ListItemRow label="Reedeming (DAI)" dark>
          {daiDebt}
        </ListItemRow>
        <ListItemRow label="Reedeming (DAI)" dark>
          {vaultValue}
        </ListItemRow>
        <Flex alignItems="center" justifyContent="center" my="m">
          {redeemButton}
        </Flex>

      </Box>
    </Card>
  );
}

const RedeemVaults = ({
  vaultsToRedeem,
  onClose
}) => {
  const { maker } = useMaker();
  const [hasReadTOS, setHasReadTOS] = useState(false);
  const [redeemInitiated, setRedeemInitiated] = useState([]);
  const [redeemDone, setRedeemDone] = useState([]);

  const [, dispatch] = useStore();

  if (!maker) return null;

  const redeemVaults = async (vaultId, ilk) => {
    try {
      setRedeemInitiated(redeemInitiated => [...redeemInitiated, vaultId]);
      const mig = maker
        .service('migration')
        .getMigration('global-settlement-collateral-claims');
      await mig.free(vaultId, ilk);
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
    'Price',
    'Collateral',
    'Dai Debt',
    'Available',
    'Action'
  ];

  return (
    <Grid maxWidth="912px" gridRowGap="m" px={['s', 0]}>
      <Text.h2 textAlign="center">
        Withdraw Excess Collateral from Vaults
      </Text.h2>
      <Grid gridRowGap="xs">
        <Text.p fontSize="1.7rem" color="darkLavender" textAlign="center">
          Withdraw excess collateral from your Multi-Collateral Dai Vaults.
        </Text.p>
      </Grid>
      <Card px={'m'} py={'m'}>
        <TOSCheck {...{ hasReadTOS, setHasReadTOS }} />
      </Card>
      <Grid maxWidth="912px" px={['s', 0]} justifyContent="center">
        <Box display={['none', 'block']}>
          <Grid
            mt="m"
            px="l"
            pb="0"
            gridTemplateColumns={TABLE_COLUMNS}
            gridColumnGap="l"
            alignItems="center"
            fontWeight="medium"
            color="steelLight"
            css="white-space: nowrap;"
          >

            <Flex flexDirection='row' alignItems="center">
              <Text t="subheading">{tableHeaders[0]}</Text>
            </Flex>
            <Flex flexDirection='row' alignItems="center">
              <Text t="subheading">{tableHeaders[1]}</Text>
              <Tooltip
                color="steel"
                fontSize="m"
                ml="2xs"
                content={
                  <div/>
                }
              />
            </Flex>
            <Flex flexDirection='row' alignItems="center">
              <Text t="subheading">{tableHeaders[2]}</Text>
              <Tooltip
                color="steel"
                fontSize="m"
                ml="2xs"
                content={
                  <TooltipContents>
                    Collateral token price at time of shutdown
                  </TooltipContents>
                }
              />
            </Flex>
            <Flex flexDirection='row' alignItems="center">
              <Text t="subheading">{tableHeaders[3]}</Text>
              <Tooltip
                color="steel"
                fontSize="m"
                ml="2xs"
                content={
                  <div/>
                }
              />
            </Flex>
            <Flex flexDirection='row' alignItems="center">
              <Text t="subheading">{tableHeaders[4]}</Text>
              <Tooltip
                color="steel"
                fontSize="m"
                ml="2xs"
                content={
                  <div/>
                }
              />
            </Flex>
            <Flex flexDirection='row' alignItems="center">
              <Text t="subheading">{tableHeaders[5]}</Text>
              <Tooltip
                color="steel"
                fontSize="m"
                ml="2xs"
                content={
                  <TooltipContents>
                    Amount of collateral available after canceling out your
                    Dai debt with collateral priced at the shutdown value
                  </TooltipContents>
                }
              />
            </Flex>
            <span />
          </Grid>
        </Box>
        <Grid gridRowGap="s" pb="m" mt="m">
          {vaultsToRedeem && vaultsToRedeem.parsedVaultsData.map(vault => (
            <ListItem
              key={vault.id}
              vaultId={vault.id}
              collateral={vault.collateral}
              type={vault.type}
              ilk={vault.ilk}
              daiDebt={vault.daiDebt}
              shutdownValue={vault.shutdownValue}
              vaultValue={vault.vaultValue}
              redeemInitiated={redeemInitiated}
              redeemDone={redeemDone}
              hasReadTOS={hasReadTOS}
              redeemVaults={redeemVaults}
            />
          ))}
        </Grid>
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
