import React from 'react';
import {
  Grid,
  Text,
  Button,
  Link,
  Flex,
  Box
} from '@makerdao/ui-components-core';
import arrowTopRight from '../../assets/icons/arrowTopRight.svg';
import daiRedeem from '../../assets/icons/daiRedeem.svg';
import { etherscanLink } from '../../utils/ui';
import useMaker from '../../hooks/useMaker';

function Complete({ redeemTxHash, onClose }) {
  const { network } = useMaker();

  return (
    <Grid maxWidth="567px" gridRowGap="m" mx={'s'}>
      <Text.h2 textAlign="center">Your Dai is being redeemed</Text.h2>
      <Text.p fontSize="1.7rem" color="darkLavender" textAlign="center">
        The estimated time is 8 minutes. Please wait until this transaction has
        confirmed before leaving
      </Text.p>
      <Link
        justifySelf="center"
        target="_blank"
        href={etherscanLink(redeemTxHash, network)}
      >
        <Button
          my="xs"
          justifySelf="center"
          fontSize="s"
          p="s"
          variant="secondary"
        >
          <Flex>
            <Text.p t="body">View transaction details </Text.p>
            &nbsp;
            <img src={arrowTopRight} />
          </Flex>
        </Button>
      </Link>
      <Box justifySelf="center">
        <img src={daiRedeem} />
      </Box>
      <Button
        variant="secondary-outline"
        onClick={onClose}
        justifySelf="center"
        width="200px"
      >
        Exit
      </Button>
    </Grid>
  );
}

export default Complete;
