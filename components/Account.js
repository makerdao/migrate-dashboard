import { Flex, Text } from '@makerdao/ui-components-core'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import { cutMiddle } from '../utils'

function Account({ provider, address }) {
  return <Flex alignItems="center" justifyContent="center">
    <Jazzicon diameter={20} seed={jsNumberForAddress(address)}/>
    <Text display="block" ml="xs" color="steel">{provider} {cutMiddle(address)}</Text>
  </Flex>
}

export default Account
