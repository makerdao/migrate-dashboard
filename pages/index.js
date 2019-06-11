import styled from 'styled-components'
import Header from '@makerdao/ui-components-header'
import Footer from '@makerdao/ui-components-footer'
import { Box, Flex, Text, Button, Grid } from '@makerdao/ui-components-core'

const Feature = ({ title, body }) => {
  return <Grid gridRowGap='s'>
    <Box borderRadius="circle" bg="grey.300" width="4.8rem" height="4.8rem"/>
    <Text.h4>{title}</Text.h4>
    <Text.p lineHeight="normal">{body}</Text.p>
  </Grid>
}

const DatedInfo = ({ date, title, body }) => {
  return <Grid pt="l" pb="xl" gridTemplateColumns="auto 1fr">
    <Box style={{ gridRow: "span 2" }} mr="2xl">
      <Text t="subheading">{ date }</Text>
    </Box>
    <Text.h5 fontWeight="normal" mb="s" fontSize="1.8rem" letterSpacing="-0.12px" color="darkPurple">{ title }</Text.h5>
    <Box>
      <Text.p lineHeight="normal" color="darkLavender">{ body }</Text.p>
    </Box>
  </Grid>
}

function Home() {
  return <Flex flexDirection="column" minHeight="100vh">
    <Header/>
    <Box maxWidth="113.4rem" width="100%" m="0 auto" px="m" pb="xl">
      <Box width="57.6rem" mt="xl">
        <Text.h1 mb='s'>Migrate</Text.h1>
        <Text.p fontSize="2rem" color="darkLavender" lineHeight='1.3' letterSpacing="0.3px" mb="m">
          Upgrade your DAI, MKR, and CDPs to their respective updated versions, and claims funds after emergency shutdown and other system updates.
        </Text.p>
        <Button>Connect wallet</Button>
      </Box>
    </Box>
    <Box bg="white" flexGrow="1">
      <Box maxWidth="113.4rem" width="100%" m="0 auto" px='m' mt="xl">
        <Grid gridTemplateColumns={{ s: "1fr", l: "repeat(3, 1fr)"}} gridColumnGap="2xl">
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
  </Flex>;
}

export default Home;
