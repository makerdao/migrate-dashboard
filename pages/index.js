import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Header from '@makerdao/ui-components-header';
import Footer from '@makerdao/ui-components-footer';
import { Box, Flex, Text, Grid } from '@makerdao/ui-components-core';
import Link from 'next/link';
import { getWebClientProviderName } from '../utils/web3';
import { Breakout } from '../components/Typography';
import useMaker from '../hooks/useMaker';

import WalletManager from '../components/WalletManager';

const Feature = ({ title, body }) => {
  return (
    <Grid gridRowGap="s">
      <Box
        borderRadius="circle"
        bg="grey.300"
        width="4.8rem"
        height="4.8rem"
        mb="2xs"
      />
      <Text.h4>{title}</Text.h4>
      <Text.p lineHeight="normal" color="darkLavender">
        {body}
      </Text.p>
    </Grid>
  );
};

const WithSeparator = styled(Box).attrs(props => {
  return {
    borderBottom: 'default',
    borderColor: 'grey.200'
  };
})`
  &:last-child {
    border: none;
  }
`;

const DatedInfo = ({ date, title, body }) => {
  return (
    <WithSeparator>
      <Grid pt="l" pb="xl" gridTemplateColumns={{ s: '1fr', m: 'auto 1fr' }}>
        <Box
          style={{ gridRow: 'span 2' }}
          mr="2xl"
          mb={{ s: 'xs', m: 'unset' }}
        >
          <Text t="subheading">{date}</Text>
        </Box>
        <Text.h5
          fontWeight="normal"
          mb="s"
          fontSize="1.8rem"
          letterSpacing="-0.12px"
          color="darkPurple"
        >
          {title}
        </Text.h5>
        <Box>
          <Text.p lineHeight="normal" color="darkLavender">
            {body}
          </Text.p>
        </Box>
      </Grid>
    </WithSeparator>
  );
};

function Index() {
  return (
    <Flex flexDirection="column" minHeight="100vh">
      <Header />
      <Grid
        maxWidth="113.4rem"
        width="100%"
        m="0 auto"
        px="m"
        pt={{ s: 'm', l: 'xl' }}
        pb={{ s: 'xl', l: 'l' }}
        gridTemplateColumns={{ s: '1fr', l: 'auto auto' }}
        gridColumnGap="xl"
        gridRowGap="m"
      >
        <Box
          maxWidth="57.6rem"
          width="100%"
          mt="xl"
          textAlign={{ s: 'center', l: 'left' }}
          justifySelf={{ s: 'center', l: 'unset' }}
        >
          <Text.h1 mb="s">Migrate</Text.h1>
          <Breakout>
            Use Migrate after system updates to change your Dai and CDPs into
            their new Multi-Collateral versions. Connect your wallet to view
            available migrations for your account.
          </Breakout>
        </Box>
        <WalletManager />
      </Grid>
      <Footer />
    </Flex>
  );
}

export default Index;
