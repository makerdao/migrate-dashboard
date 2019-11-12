import React from 'react';
import { Grid, Text, Button, Link } from '@makerdao/ui-components-core';

// import { etherscanLink } from '../../utils/ethereum';
import arrowTopRight from '../../assets/icons/arrowTopRight.svg';
// import useMaker from '../../hooks/useMaker';

export default ({ onNext, onPrev, onClose, migrationTxHash }) => {
  // const { network } = useMaker();

  return (
    <Grid
      gridRowGap="m"
      px={['s', 0]}
      mx={[0, 'auto']}
      width={['100vw', 'auto']}
    >
      <Text.h2 textAlign="center">Your Sai is being upgraded</Text.h2>
      <Text.p fontSize="1.7rem" color="darkLavender" textAlign="center">
        The estimated time is 8 minutes.
      </Text.p>
      <Text.p fontSize="1.7rem" color="darkLavender" textAlign="center">
        Please wait for this transaction to confirm before leaving.
      </Text.p>
      <Button
        disabled={!migrationTxHash}
        justifySelf="center"
        fontSize="s"
        py="xs"
        px="s"
        variant="secondary"
      >
        View transaction details <img src={arrowTopRight} />
      </Button>

      <Link onClick={onNext}>next</Link>
      <Link onClick={onPrev}>back</Link>
      <Button
        onClick={onClose}
        width={['26.0rem', '13.0rem']}
        justifySelf={'center'}
      >
        Exit
      </Button>
    </Grid>
  );
};
