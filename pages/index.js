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
            their new versions. Connect your wallet to view available migrations
            for your account.
          </Breakout>
        </Box>
        <WalletManager />
      </Grid>
      <Footer />
    </Flex>
  );
}

export default Index;
