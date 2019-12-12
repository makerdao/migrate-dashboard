import React, { useEffect, useCallback, useState } from 'react';

import {
  Button,
  Grid,
  Flex,
  Text,
  Box,
  Table,
  Loader
} from '@makerdao/ui-components-core';
import useHardwareWallet from '../../hooks/useHardwareWallet';
import { cutMiddle, copyToClipboard } from '../../utils/ui';
import { CopyBtn, CopyBtnIcon } from './AddressTable';
import Cross from '../../assets/icons/cross.svg';
import { getColor } from '../../utils/theme';
import { AccountTypes } from '../../utils/constants';
import styled from 'styled-components';
import { LEDGER_LIVE_PATH } from './LedgerType';

const ACCOUNTS_PER_PAGE = 5;
const ACCOUNTS_TO_FETCH = 25;

const ListContainer = styled.div`
  margin-top: 33px;
  margin-left: 32px;
  margin-right: 32px;
`;

const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-items: flex-start;
  margin-bottom: 18px;
`;

const CircleNumber = styled.div`
  width: 32px;
  min-width: 32px;
  line-height: 28px;
  border-radius: 50%;
  text-align: center;
  font-size: 16px;
  border: 2px solid #30bd9f;
  margin-right: 18px;
  margin-top: 4px;
`;

const ListText = styled.div`
  margin-top: 5px;
  margin-right: 16px;
  flex-grow: 1;
  line-height: 25px;
  font-size: 17px;
  color: #868997;
`;

const LedgerLoading = () => (
  <ListContainer>
    <ListItem>
      <CircleNumber>1</CircleNumber>
      <ListText>Connect your Ledger to begin</ListText>
    </ListItem>
    <ListItem>
      <CircleNumber>2</CircleNumber>
      <ListText>Open the Ethereum app on the Ledger</ListText>
    </ListItem>
    <ListItem>
      <CircleNumber>3</CircleNumber>
      <ListText>
        Ensure the Browser Support and Contract Data is enabled in Settings
      </ListText>
    </ListItem>
    <ListItem>
      <CircleNumber>4</CircleNumber>
      <ListText>
        You may need to update the firmware if Browser Support is not available
      </ListText>
    </ListItem>
  </ListContainer>
);

const TrezorLoading = () => (
  <ListContainer>
    <ListItem>
      <CircleNumber>1</CircleNumber>
      <ListText>Connect your TREZOR Wallet to begin</ListText>
    </ListItem>
    <ListItem>
      <CircleNumber>2</CircleNumber>
      <ListText>
        When the popop asks if you want to export the public key, select export
      </ListText>
    </ListItem>
    <ListItem>
      <CircleNumber>3</CircleNumber>
      <ListText>
        If required, enter your pin or password to unlock the TREZOR
      </ListText>
    </ListItem>
  </ListContainer>
);

function HardwareAccountSelect({ type, path, onClose, confirmAddress }) {
  const [page, setPage] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const accountsToFetch = (type === AccountTypes.LEDGER && path === LEDGER_LIVE_PATH) ? ACCOUNTS_PER_PAGE * 2 : ACCOUNTS_TO_FETCH; //fetching accounts only works the first two times for some reason, but loading ledger live addresses is very slow
  const { fetchMore, connect, accounts, pickAccount, fetching } = useHardwareWallet(
    { type, accountsLength: accountsToFetch, path }
  );

  useEffect(() => {
    connect().then(address => {
      confirmAddress(address);
      onClose();
    }, onClose);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toPage = async page => {
    if (accounts.length <= page * ACCOUNTS_PER_PAGE) await fetchMore();
    setPage(page);
  };

  const selectAddress = useCallback(
    address => {
      setSelectedAddress(address);
    },
    [setSelectedAddress]
  );

  const onConfirm = () => {
    pickAccount(selectedAddress);
  };

  const start = page * ACCOUNTS_PER_PAGE;
  const renderedAccounts = accounts.slice(start, start + ACCOUNTS_PER_PAGE);

  return !renderedAccounts.length ? (
    <Grid gridRowGap="m" width={['100%', '53rem']}>
      <Flex justifyContent="flex-end">
        <Box onClick={onClose} css={{ cursor: 'pointer' }}>
          <img src={Cross} />
        </Box>
      </Flex>
      <Grid gridRowGap="s">
        <Text.h3 textAlign="center">Connect your {type} wallet</Text.h3>
      </Grid>
      {type === AccountTypes.LEDGER ? <LedgerLoading /> : <TrezorLoading />}
      <Flex justifyContent="center">
        <Loader size="5rem" color={getColor('makerTeal')} mb="l"/>
      </Flex>
    </Grid>
  ) : (
    <Grid gridRowGap="m" width={['100%', '53rem']}>
      <Flex justifyContent="flex-end">
        <Box onClick={onClose} css={{ cursor: 'pointer' }}>
          <img src={Cross} />
        </Box>
      </Flex>
      <Grid gridRowGap="s">
        <Text.h3 textAlign="center">Select address</Text.h3>
        <Text.p t="body" fontSize="1.8rem" textAlign="center">
          Please select which address you would like to open
        </Text.p>
      </Grid>

      <Grid
        width="100%"
        gridColumnGap="s"
        gridRowGap="s"
        gridTemplateColumns="auto auto"
      >
        <Button
          variant="secondary-outline"
          disabled={page === 0 || fetching}
          onClick={() => toPage(page - 1)}
        >
          &#60;
        </Button>
        <Button
          variant="secondary-outline"
          disabled={fetching}
          onClick={() => toPage(page + 1)}
        >
          &#62;
        </Button>
      </Grid>
      <div>
        <Table width="100%" opacity={fetching ? 0.6 : 1}>
          <thead>
            <tr>
              <th css={{ textAlign: 'center' }}>Select</th>
              <th>
                <Box pr="m" textAlign="center">
                  #
                </Box>
              </th>
              <th>Address</th>
              <th>ETH</th>
            </tr>
          </thead>
          <tbody>
            {renderedAccounts.map(({address, ethBalance}, index) => (
              <tr key={address}>
                <td>
                  <Flex justifyContent="center">
                    <input
                      type="radio"
                      name="address"
                      value={index}
                      checked={address === selectedAddress}
                      onChange={() => selectAddress(address)}
                    />
                  </Flex>
                </td>
                <td>
                  <Box pr="m" textAlign="center">
                    {page * ACCOUNTS_PER_PAGE + (index + 1)}
                  </Box>
                </td>
                <td>
                  <Flex alignItems="center">
                    {cutMiddle(address, 7, 5)}
                    <CopyBtn onClick={() => copyToClipboard(address)}>
                      <CopyBtnIcon />
                    </CopyBtn>
                  </Flex>
                </td>
                <td>{ethBalance} ETH</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Grid
        width="100%"
        gridRowGap="xs"
        gridColumnGap="s"
        gridTemplateColumns={['1fr', 'auto auto']}
        justifyContent="center"
        justifySelf={['stretch', 'center']}
      >
        <Button variant="secondary-outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={!selectedAddress} onClick={onConfirm}>
          Confirm
        </Button>
      </Grid>
    </Grid>
  );
}

export default HardwareAccountSelect;
