import { Box, Flex, Text } from '@makerdao/ui-components-core'

function ButtonCard({ children, buttonTag, button, ...props }) {
  return <Flex flexDirection="column" borderRadius="default" border="default" bg="white" {...props}>
    <Box px="l" py="l" flexGrow="1">
      { children }
    </Box>
    <Box px="l" py="m" borderTop="default">
      <Flex justifyContent="space-between" alignItems="center">
        {buttonTag}
        {button}
      </Flex>
    </Box>
  </Flex>
}

export default ButtonCard
