import { Box, Flex, Text } from '@makerdao/ui-components-core';

function ButtonCard({ children, buttonTag, button, flipped, ...props }) {
  const formatButtons = (isFlipped) => {
    if (isFlipped) return [button, buttonTag]
    return [buttonTag, button]
  }
  const buttons = formatButtons(flipped)
  return (
    <Flex
      flexDirection="column"
      borderRadius="default"
      border="default"
      bg="white"
      {...props}
    >
      <Box px="l" py="l" flexGrow="1">
        {children}
      </Box>
      <Box px="m" py="m" borderTop="default">
        <Flex justifyContent="space-between">
          {buttons}
        </Flex>
      </Box>
    </Flex>
  );
}

export default ButtonCard;
