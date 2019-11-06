import React from 'react';
import { Grid, Text, Button, Link } from '@makerdao/ui-components-core';

import arrowTopRight from '../../assets/icons/arrowTopRight.svg';

function Migrating({ onNext, onPrev, onReset, onClose, migrationTxObject }) {
  return (
    <Grid
      gridRowGap="m"
      px={['s', 0]}
      mx={[0, 'auto']}
      width={['100vw', 'auto']}
    >
      <Text.h2 textAlign="center">Your CDP is being migrated</Text.h2>
      <Text.p fontSize="1.7rem" color="darkLavender">
        The estimated time is 8 minutes.
      </Text.p>
      <Button
        justifySelf="center"
        fontSize="s"
        py="xs"
        px="s"
        variant="secondary"
      >
        View transaction details <img src={arrowTopRight} />
      </Button>

      {/* DELETE ME AFTER: */}
      <Link onClick={onNext}>next</Link>
      <Link onClick={onPrev}>back</Link>
    </Grid>
  );
}

export default Migrating;
