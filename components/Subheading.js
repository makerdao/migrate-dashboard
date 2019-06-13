import { Flex, Card, Text } from '@makerdao/ui-components-core'

import Account from './Account'

function Subheading({ ...props }) {
  return <Flex justifyContent="space-between" alignItems="center" {...props} maxWidth="111.4rem" mt="m" mb="xs" mx="auto" px="m">
    <Text.h5 display={{ s: 'none', m: 'block' }}>Migrate and Redeem</Text.h5>
    <Card py="xs" px="m" flexGrow={{ s: '1', m: '0' }}>
      <Account address={'0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef'} provider={'MetaMask'}/>
    </Card>
  </Flex>
}

export default Subheading
