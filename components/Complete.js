import React from 'react';
import { Grid, Text, Button } from '@makerdao/ui-components-core';
import useMaker from '../hooks/useMaker';
import { TxLink } from './InProgress';

function Complete({
  onClose,
  txHash,
  txHashes = [],
  txCount,
  title,
  description,
  children
}) {
  const { network } = useMaker();
  if (txHashes.length === 0 && txHash) txHashes = [txHash];

  return (
    <Grid gridRowGap="m" mx={'s'}>
      <Text.h2 textAlign="center">{title}</Text.h2>
      <Text.p fontSize="1.7rem" color="darkLavender" textAlign="center">
        {description}
      </Text.p>
      {txHashes.map((hash, index) => (
        <TxLink key={hash} total={txCount} {...{ index, hash, network }} />
      ))}
      {children}
      <Button
        mt="s"
        onClick={onClose}
        width={['26.0rem', '13.0rem']}
        justifySelf={'center'}
      >
        Exit
      </Button>
    </Grid>
  );
}

export default Complete;
