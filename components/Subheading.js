import { Flex, Card, Text, Address } from '@makerdao/ui-components-core'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

function Subheading({ ...props }) {
  return <Flex justifyContent="space-between" alignItems="center" {...props} maxWidth="111.4rem" mt="m" mb="xs" mx="auto" px="m">
    <Text.h5 display={{ s: 'none', m: 'block' }}>Migrate and Redeem</Text.h5>
    <Card py="xs" px="m" flexGrow={{ s: '1', m: '0' }}>
      <Flex alignItems="center" justifyContent="center">
        <Jazzicon diameter={20} seed={jsNumberForAddress("0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef")}/>
        <Text display="block" ml="xs" color="steel">MetaMask <Address shorten full="0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef" placement="bottom"></Address></Text>
      </Flex>
    </Card>
  </Flex>
}

export default Subheading
