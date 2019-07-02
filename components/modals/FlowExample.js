import { Stepper, Grid, Text, Flex, Box, Button } from '@makerdao/ui-components-core'
import FlowBackground from './FlowBackground'
import Account from '../Account'

import crossCircle from '../../assets/icons/crossCircle.svg'

function FlowExample({ open, onClose, account }) {
  return <FlowBackground open={open}>
    <Grid gridRowGap="xl">
      <Grid justifyContent="flex-end" gridTemplateColumns="auto auto" gridColumnGap="m" pt="xl" px="m">
        <Account account={account} />
        <Flex alignItems="center" onClick={onClose} css={{ cursor: 'pointer' }}><img src={crossCircle}/>&nbsp;<Text color="steel" fontWeight="medium">Close</Text></Flex>
      </Grid>
      <Stepper steps={['Approve', 'Redeem', 'Confirmation']} m="0 auto"/>
      <Flex flexDirection="column" alignItems="center">
        <Text.h2 textAlign="center" mb="s">Approve exchange of tokens</Text.h2>
        <Text.p fontSize="xl" color="darkLavender" textAlign="center">This transaction allows the redeemer contract to operate on your Dai tokens.</Text.p>
        <Button variant="secondary" mt="l">View transaction details</Button>
      </Flex>
    </Grid>
  </FlowBackground>
}

export default FlowExample
