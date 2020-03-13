import React from 'react';
import {
  Grid,
  Text,
  Button,
  Link
} from '@makerdao/ui-components-core';
import arrowTopRight from '../../assets/icons/arrowTopRight.svg';
import { etherscanLink } from '../../utils/ui';
import useMaker from '../../hooks/useMaker';

function Complete({
  onClose,
  redeemTxHash,
}) {
  const { network } = useMaker();

  return (
    <Grid gridRowGap="m" mx={'s'}>
      <Text.h2 textAlign="center">Vault Redeem Complete</Text.h2>
      <Text.p fontSize="1.7rem" color="darkLavender" textAlign="center">
        Your Vault has been successfully redeemed, you may leave the page.{' '}
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
          py="xs"
          px="s"
          variant="secondary"
        >
          View transaction details <img src={arrowTopRight} />
        </Button>
      </Link>
      <Grid gridRowGap="s" justifySelf="center">
        <Button variant="secondary-outline" onClick={onClose}>
          Exit
        </Button>
      </Grid>
    </Grid>
  );
}

export default Complete;
