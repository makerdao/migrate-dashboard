import React from 'react';
import { Flex, Card, Text } from '@makerdao/ui-components-core';
import Account from './Account';

const NoAccount = () => {
  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text t="p5">Read-only Mode</Text>
    </Flex>
  );
};

function Subheading({ account, ...props }) {
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      {...props}
      maxWidth="111.4rem"
      mt="m"
      mb="xs"
      mx="auto"
      px="m"
    >
      <Text.h5 display={{ s: 'none', m: 'block' }}>Migrate</Text.h5>
      <Card py="xs" px="m" flexGrow={{ s: '1', m: '0' }}>
        {account ? <Account account={account} /> : <NoAccount />}
      </Card>
    </Flex>
  );
}

export default Subheading;
