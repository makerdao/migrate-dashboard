import React from 'react';
import { Flex, Text } from '@makerdao/ui-components-core';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { cutMiddle } from '../utils';
import { shortWalletName } from '../utils/web3';
import useStore from '../hooks/useStore';

function Account({ account }) {
  const { address } = account;
  const [{ providerName, accountType }] = useStore();
  return (
    <Flex alignItems="center" justifyContent="center">
      <Jazzicon diameter={20} seed={jsNumberForAddress(address)} />
      <Text display="block" ml="xs" color="steel">
        {shortWalletName(providerName, accountType)} {cutMiddle(address, 6)}
      </Text>
    </Flex>
  );
}

export default Account;
