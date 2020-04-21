import React from 'react';
import { Grid, Text, Button, Link, Flex } from '@makerdao/ui-components-core';
import useMaker from '../hooks/useMaker';
import useWaitTime from '../hooks/useWaitTime';
import { etherscanLink } from '../utils/ui';
import arrowTopRight from '../assets/icons/arrowTopRight.svg';

export default ({
  migrationTxHash,
  txHashes = [],
  txCount = 1,
  title,
  image
}) => {
  const { maker, network } = useMaker();
  const waitTime = useWaitTime(maker);
  if (txHashes.length === 0 && migrationTxHash) txHashes = [migrationTxHash];

  return (
    <Grid
      gridRowGap="m"
      px={['s', 0]}
      mx={[0, 'auto']}
      width={['100vw', 'auto']}
    >
      <Text.h2 textAlign="center">{title}</Text.h2>
      <Text.p fontSize="1.7rem" color="darkLavender" textAlign="center">
        The estimated time is {waitTime * txCount || 'being calculated'}. Please
        wait until{' '}
        {txCount > 1 ? `${txCount} transactions have` : 'this transaction has'}{' '}
        confirmed before leaving.
      </Text.p>
      {txHashes.map((hash, index) => (
        <TxLink key={hash} total={txCount} {...{ index, hash, network }} />
      ))}
      {image && (
        <Flex justifyContent="center">
          <img src={image} css={{ marginTop: '20px' }} />
        </Flex>
      )}
    </Grid>
  );
};

export function TxLink({ hash, network, index, total }) {
  return (
    <Link
      justifySelf="center"
      target="_blank"
      href={etherscanLink(hash, network)}
    >
      <Button
        justifySelf="center"
        fontSize="s"
        py="xs"
        px="s"
        variant="secondary"
      >
        View transaction {total > 1 && `${index + 1} `}
        details <img src={arrowTopRight} />
      </Button>
    </Link>
  );
}
