import React from 'react';
import { Grid, Text, Button, Link } from '@makerdao/ui-components-core';

import useMaker from '../../hooks/useMaker';
import useWaitTime from '../../hooks/useWaitTime';
import { etherscanLink } from '../../utils/ethereum';
import arrowTopRight from '../../assets/icons/arrowTopRight.svg';

export default ({ loadingTx, migrationTxHash }) => {
  const { maker, network } = useMaker();
  const waitTime = useWaitTime(maker);

  return (
    <Grid
      gridRowGap="m"
      px={['s', 0]}
      mx={[0, 'auto']}
      width={['100vw', 'auto']}
    >
      <Text.h2 textAlign="center">Your CDP is being migrated</Text.h2>
      <Text.p fontSize="1.7rem" color="darkLavender" textAlign="center">
        The estimated time is {waitTime || 'being calculated'}.
      </Text.p>
      {!loadingTx && migrationTxHash && (
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
    </Grid>
  );
};
