import React from 'react';
import { Grid, Box, Text, Button, Link } from '@makerdao/ui-components-core';

import useMaker from '../../hooks/useMaker';
import { etherscanLink } from '../../utils/ethereum';
import arrowTopRight from '../../assets/icons/arrowTopRight.svg';
import LoadingBar from '../LoadingBar';

export default ({ onClose, loadingTx, migrationTxHash }) => {
  const { network } = useMaker();

  return (
    <Grid
      gridRowGap="m"
      px={['s', 0]}
      mx={[0, 'auto']}
      width={['100vw', 'auto']}
    >
      <Text.h2 textAlign="center">Your CDP is being migrated</Text.h2>
      <Text.p fontSize="1.7rem" color="darkLavender" textAlign="center">
        The estimated time is 8 minutes.
      </Text.p>
      {!loadingTx && migrationTxHash ? (
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
      ) : null}
      {loadingTx ? (
        <Box m={'m'}>
          <LoadingBar />
        </Box>
      ) : null}
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
