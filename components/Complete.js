import React from 'react';
import {
  Grid,
  Text,
  Button,
  Link
} from '@makerdao/ui-components-core';
import arrowTopRight from '../../assets/icons/arrowTopRight.svg';
import { etherscanLink, prettifyNumber } from '../../utils/ui';
import useMaker from '../../hooks/useMaker';

function Complete({ onClose, txHash, title, description, completeBody }) {
  const { network } = useMaker();

  return (
    <Grid gridRowGap="m" mx={'s'}>
      <Text.h2 textAlign="center">{title}</Text.h2>
      <Text.p fontSize="1.7rem" color="darkLavender" textAlign="center">
        {description}
      </Text.p>
      <Link
        justifySelf="center"
        target="_blank"
        href={etherscanLink(txHash, network)}
      >
        <Button
          my="xs"
          justifySelf="center"
          fontSize="s"
          py="xs"
          px="s"
          variant="secondary"
        >
          View transaction details <img src={arrowTopRight} />
        </Button>
      </Link>

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
