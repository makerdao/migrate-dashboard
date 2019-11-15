import React from 'react';
import { Grid, Text, Flex, Box, Link } from '@makerdao/ui-components-core';
import crossCircle from '../assets/icons/crossCircle.svg';
import Account from './Account';
import Router from 'next/router';
import arrowTopRight from '../assets/icons/arrowTopRight.svg';
import threeDots from '../assets/icons/threeDots.svg';
import { etherscanLink } from '../utils/ui';
import useMaker from '../hooks/useMaker';

const TxLoader = ({ hash }) => {
  const { network } = useMaker();
  return (
    <Flex alignItems="center" p="0px">
      <img src={threeDots} />
      <Text mx="m" fontSize="16px">
        TX in progress
      </Text>
      {hash && (
        <Box
          border="1px solid #D4D9E1"
          borderRadius="4px"
          width="78"
          height="35"
          px="s"
          py="xs"
        >
          <Text fontSize="14px">View </Text>
          <Link target="_blank" href={etherscanLink(hash, network)}>
            <img src={arrowTopRight} />
          </Link>
        </Box>
      )}
    </Flex>
  );
};

export default function FlowHeader({ account, showClose }) {
  return (
    <Grid
      justifyContent={['space-between', 'flex-end']}
      gridTemplateColumns="auto auto"
      gridColumnGap="m"
      pt={['m', 'xl']}
      px="m"
    >
      <Box
        bg={['white', 'rgba(0,0,0,0)']}
        p={['s']}
        border={['1px solid #D8DFE3', 'none']}
        style={{ borderRadius: 6 }}
      >
        {account && <Account account={account} />}
      </Box>
      {showClose && (
        <Flex
          alignItems="center"
          onClick={() => Router.replace('/overview')}
          css={{ cursor: 'pointer' }}
        >
          <img src={crossCircle} />
          &nbsp;
          <Text color="steel" fontWeight="medium" display={{ s: 'none' }}>
            Close
          </Text>
        </Flex>
      )}
    </Grid>
  );
}
