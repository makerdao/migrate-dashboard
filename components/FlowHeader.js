import React from 'react';
import { Grid, Text, Flex, Box } from '@makerdao/ui-components-core';
import crossCircle from '../assets/icons/crossCircle.svg';
import Account from './Account';
import Router from 'next/router';

export default function FlowHeader({ account }) {
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
        {account ? <Account account={account} /> : null}
      </Box>
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
    </Grid>
  );
}
