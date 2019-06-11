import React from 'react'
import Header from '@makerdao/ui-components-header'
import { Box, Flex, Text, Card, Grid, Button, Link } from '@makerdao/ui-components-core'

import { Breakout } from '../components/Typography'
import ButtonCard from '../components/ButtonCard'
import Subheading from '../components/Subheading'
import Footer from '../components/Footer'

import checkmark from '../assets/icons/checkmark.svg'

function Migration({ title, body, recommended, metadataTitle, metadataValue }) {
  return <ButtonCard minHeight="25.3rem" buttonTag={<Grid gridRowGap="2xs">
    <Text t="subheading" color="darkLavender">{metadataTitle}</Text>
    <Text t="body">{metadataValue}</Text>
  </Grid>} button={<Button px="xl" variant={recommended ? 'primary' : 'secondary-outline'}>Continue</Button>}>
    <Grid gridTemplateAreas={`"title recommended" "body body"`} gridTemplateColumns="1fr auto" gridColumnGap="m" gridRowGap="m">
      <Box gridArea="title" alignSelf="center"><Text.h4>{ title }</Text.h4></Box>
      <Box gridArea="recommended" alignSelf="center" justifySelf="end">{ recommended && <Recommended/> }</Box>
      <Box gridArea="body"><Text.p t="body">{ body }</Text.p></Box>
    </Grid>
  </ButtonCard>
}

function Recommended() {
  return <Flex alignItems="center">
    <img src={checkmark}/>
    <Text.p t="subheading" color="makerTeal" ml="xs">Recommended</Text.p>
  </Flex>
}

function Overview() {
  return <Flex flexDirection="column" minHeight="100vh">
    <Header/>
    <Box borderBottom="1px solid" borderColor="grey.300"/>
    <div><Subheading/></div>

    <Box maxWidth="112.5rem" width="100%" mx="auto" px="m" flexGrow="1">
      <Box mt={{ s: "m", m: "2xl" }} maxWidth="64.2rem" width="100%">
        <Text.h2 mb="s">Migrate and Redeem</Text.h2>
        <Breakout>Upgrade your DAI, MKR, and CDPs to their respective updated versions. Redeem and withdraw collateral during emergency shutdown.</Breakout>
      </Box>


      <Grid mt="l" gridTemplateColumns={{ s: '1fr', l: '1fr 1fr' }} gridGap="l">
        <Migration
          recommended
          title="Dai Redeemer"
          body="Redeem your Dai holdings into either Single Collateral Dai (SCD) or Multi Collateral Dai (MCD)."
          metadataTitle="SCD Balance"
          metadataValue="1,400.00 DAI"/>
        <Migration
          recommended
          title="CDP Migrate"
          body="Migrate your CDPs to the newest version of the CDP Portal."
          metadataTitle="SCD Balance"
          metadataValue="1,400.00 DAI"/>
        <Migration
          recommended
          title="DSChief MKR Withdrawal"
          body="Due to the recent discovery of a potential exploit in the Maker Governance Contract (DSChief), all users are requested to withdraw any MKR deposited into one of the voting contracts back to their wallet."
          metadataTitle="SCD Balance"
          metadataValue="1,400.00 DAI"/>
        <Migration
          title="Dai Redeemer"
          body="Redeem your Dai holdings into either Single Collateral Dai (SCD) or Multi Collateral Dai (MCD)."
          metadataTitle="SCD Balance"
          metadataValue="1,400.00 DAI"/>
      </Grid>

      <Box mt="xl">
        <Text.p t="body" fontSize="s" color="steelLight" textAlign='center'>No other migrations or redemptions to make in this wallet.</Text.p>
      </Box>

      {/*
        <Card mt="l">
        <Flex justifyContent="center" py="l" px="m">
          <Text.p textAlign="center" t="body">
            You're all set! There are no migrations or redemptions to make using this wallet.
            <br/>
            <Text.span display={{ s: 'block', m: 'none' }} mt='m'/>
            Please visit us at <Link>chat.makerdao.com</Link> if you have any questions.
          </Text.p>
        </Flex>
      </Card>
      */}
    </Box>
    <Footer mt="2xl"/>
  </Flex>
}

export default Overview
