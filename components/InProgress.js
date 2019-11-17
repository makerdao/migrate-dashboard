import React from 'react';
import { Grid, Text, Button, Link, Flex } from '@makerdao/ui-components-core';
import useMaker from '../hooks/useMaker';
import useWaitTime from '../hooks/useWaitTime';
import { etherscanLink } from '../utils/ui';
import arrowTopRight from '../assets/icons/arrowTopRight.svg';

export default ({ migrationTxHash, title, image }) => {
  const { maker, network } = useMaker();
  const waitTime = useWaitTime(maker);

  return (
    <Grid
      gridRowGap="m"
      px={['s', 0]}
      mx={[0, 'auto']}
      width={['100vw', 'auto']}
    >
      <Text.h2 textAlign="center">{title}</Text.h2>
      <Text.p fontSize="1.7rem" color="darkLavender" textAlign="center">
        The estimated time is {waitTime || 'being calculated'}.
      </Text.p>
      {migrationTxHash && (
        <Link
          justifySelf="center"
          target="_blank"
          href={etherscanLink(migrationTxHash, network)}
        >
          <Button
            justifySelf="center"
            fontSize="s"
            py="xs"
            px="s"
            variant="secondary"
          >
            View transaction details <img src={arrowTopRight} />
          </Button>
        </Link>
      )}
      {image && (
        <Flex justifyContent="center">
          <img src={image} css={{ marginTop: '-35px', width: '150px', height: '150px' }} />
        </Flex>
      )}
    </Grid>
  );
};
