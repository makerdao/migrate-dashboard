import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Header from '@makerdao/ui-components-header'
import Footer from '@makerdao/ui-components-footer'
import { Box, Flex, Text, Grid } from '@makerdao/ui-components-core'
import Link from 'next/link'
import { getWebClientProviderName } from '../utils/web3'
import { Breakout } from '../components/Typography'
import useMaker from '../hooks/useMaker';

import WalletManager from '../components/WalletManager'

const Feature = ({ title, body }) => {
  return <Grid gridRowGap='s'>
    <Box borderRadius="circle" bg="grey.300" width="4.8rem" height="4.8rem" mb="2xs"/>
    <Text.h4>{title}</Text.h4>
    <Text.p lineHeight="normal" color="darkLavender">{body}</Text.p>
  </Grid>
}

const WithSeparator = styled(Box).attrs((props) => {
  return {
    borderBottom: 'default',
    borderColor: 'grey.200'
  }
})`
  &:last-child {
    border: none;
  }
`

const DatedInfo = ({ date, title, body }) => {
  return <WithSeparator><Grid pt="l" pb="xl" gridTemplateColumns={{ s: "1fr", m: "auto 1fr" }}>
    <Box style={{ gridRow: "span 2" }} mr="2xl" mb={{ s: 'xs', m: "unset" }}>
      <Text t="subheading">{ date }</Text>
    </Box>
    <Text.h5 fontWeight="normal" mb="s" fontSize="1.8rem" letterSpacing="-0.12px" color="darkPurple">{ title }</Text.h5>
    <Box>
      <Text.p lineHeight="normal" color="darkLavender">{ body }</Text.p>
    </Box>
  </Grid></WithSeparator>
}

function Index() {
  const {
    maker,
    authenticated: makerAuthenticated,
    connectBrowserProvider
  } = useMaker();

  // const [providerName, setProviderName] = useState(0);
  // useEffect(() => {
  //   setProviderName(getWebClientProviderName())
  // });
  //
  // async function connectBrowserWallet() {
  //   try {
  //     const connectedAddress = await connectBrowserProvider();
  //     maker.useAccountWithAddress(connectedAddress);
  //   } catch (err) {
  //     window.alert(err);
  //   }
  // }

  return (
    <Flex flexDirection="column" minHeight="100vh">
      <Header/>
      <Grid maxWidth="113.4rem" width="100%" m="0 auto" px="m" pt={{ s: 'm', l: "xl" }} pb={{ s: "xl", l: "l" }} gridTemplateColumns={{ s: "1fr", l: "auto auto"}} gridColumnGap="xl" gridRowGap="m">
        <Box maxWidth="57.6rem" width="100%" mt="xl" textAlign={{ s: 'center', l: 'left'}} justifySelf={{ s: "center", l: "unset" }}>
          <Text.h1 mb='s'>Migrate</Text.h1>
          <Breakout>
            Upgrade your DAI, MKR, and CDPs to their respective updated versions, and claims funds after emergency shutdown and other system updates.
          </Breakout>
        </Box>
        <WalletManager />
      </Grid>
      <Box bg="white" flexGrow="1">
        <Box maxWidth="113.4rem" width="100%" m="0 auto" px='m' mt="xl">
          <Grid gridTemplateColumns={{ s: "1fr", l: "repeat(3, 1fr)"}} gridColumnGap="2xl" gridRowGap="xl">
            <Feature title="Migrate CDPs" body="During a system upgrade, migrate CDPs to move them into the new system. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."/>
            <Feature title="Redeem DAI & MKR" body="During a system upgrade, migrate CDPs to move them into the new system. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."/>
            <Feature title="Emergency Shutdown" body="During a system upgrade, migrate CDPs to move them into the new system. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."/>
          </Grid>
        </Box>

        <Box mt="2xl" maxWidth="113.4rem" width="100%" m="0 auto" px='m'>
          <Box borderBottom={`2px solid #E1E1E1`}>
            <Text.h5 color="darkPurple" fontWeight="normal" fontSize="1.8rem" letterSpacing="-0.12px" mb="s">Recent additions</Text.h5>
          </Box>
          <DatedInfo date="MARCH 13, 2019" title="DSChief MKR Withdrawal" body="Due to the recent discovery of a potential exploit in the Maker Governance Contract (DSChief), all users are requested to withdraw any MKR deposited into one of the voting contracts back to their wallet." />
          <DatedInfo date="MARCH 13, 2019" title="DSChief MKR Withdrawal" body="Due to the recent discovery of a potential exploit in the Maker Governance Contract (DSChief), all users are requested to withdraw any MKR deposited into one of the voting contracts back to their wallet." />
          <DatedInfo date="MARCH 13, 2019" title="DSChief MKR Withdrawal" body="Due to the recent discovery of a potential exploit in the Maker Governance Contract (DSChief), all users are requested to withdraw any MKR deposited into one of the voting contracts back to their wallet." />
          <DatedInfo date="MARCH 13, 2019" title="DSChief MKR Withdrawal" body="Due to the recent discovery of a potential exploit in the Maker Governance Contract (DSChief), all users are requested to withdraw any MKR deposited into one of the voting contracts back to their wallet." />
          <DatedInfo date="MARCH 13, 2019" title="DSChief MKR Withdrawal" body="Due to the recent discovery of a potential exploit in the Maker Governance Contract (DSChief), all users are requested to withdraw any MKR deposited into one of the voting contracts back to their wallet." />
        </Box>
      </Box>
      <Footer/>
    </Flex>
  );
}

export default Index;
