import React from 'react';
import {
  Grid,
  Text,
  Button,
  Card,
  Table,
  Link
} from '@makerdao/ui-components-core';
import arrowTopRight from '../assets/icons/arrowTopRight.svg';
import { etherscanLink } from '../utils/ethereum';
import useMaker from '../hooks/useMaker';

function Failed(props) {
  const { network } = useMaker();

  return (
    <Grid gridRowGap="m" mx={'s'}>
      <Text.h2 textAlign="center">{props.title}</Text.h2>
      <Text.p fontSize="1.7rem" color="darkLavender" textAlign="center">
        {props.subtitle}
      </Text.p>
      <Link
        justifySelf="center"
        target="_blank"
        href={etherscanLink(props.migrationTxHash, network)}
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
      <Grid gridRowGap="s" justifySelf="center">
        <Button variant="secondary-outline" onClick={props.onClose}>
          Exit
        </Button>
      </Grid>
    </Grid>
  );
}

export default Failed;
