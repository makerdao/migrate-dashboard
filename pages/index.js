import React from 'react';
import Header from '@makerdao/ui-components-header';
import Footer from '@makerdao/ui-components-footer';
import { Box, Flex, Text, Grid } from '@makerdao/ui-components-core';
import { Breakout } from '../components/Typography';

import WalletManager from '../components/WalletManager';

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
        pb={{ s: 'xl', l: 'm' }}
        gridTemplateColumns={{ s: '1fr', l: 'auto' }}
        gridColumnGap="xl"
        gridRowGap="m"
      >
        <Box
          maxWidth="57.6rem"
          width="100%"
          mt="xl"
          textAlign={{ s: 'center', l: 'center' }}
          justifySelf={{ s: 'center', l: 'center' }}
        >
          <Text.h1 alignSelf="center" mb="s">Migrate and Upgrade</Text.h1>
          <Breakout>
            Use Migrate after system updates to change your Dai, MKR, and CDPs into
            their new versions. Connect your wallet to view available migrations
            on your account.
          </Breakout>
        </Box>
      </Grid>
      <Text.h4 alignSelf="center" mb="s" color="#546978">Connect a wallet to get started</Text.h4>
      <Grid
        maxWidth="113.4rem"
        width="100%"
        m="0 auto"
        px="m"
        pb={{ s: 'xl', l: 'l' }}
        gridTemplateColumns={{ s: '1fr', l: 'auto' }}
        gridColumnGap="xl"
        gridRowGap="m"
      >
        <WalletManager />
      </Grid>
      <Footer />
    </Flex>
  );
}

export default Index;
