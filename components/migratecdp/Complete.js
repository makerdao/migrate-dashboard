import React from 'react';
import {
  Grid,
  Text,
  Button,
  Card,
  Table,
  Link
} from '@makerdao/ui-components-core';
import { OASIS_HOSTNAME } from '../../utils/constants';
import arrowTopRight from '../../assets/icons/arrowTopRight.svg';
import blueArrowTopRight from '../../assets/icons/blueArrowTopRight.svg';
import { etherscanLink } from '../../utils/ethereum';
import useMaker from '../../hooks/useMaker';

function Complete({
  onReset,
  onClose,
  selectedCDP: cdp,
  newCdpId,
  migrationTxHash,
  cdps
}) {
  const { network } = useMaker();

  return (
    <Grid gridRowGap="m" mx={'s'}>
      <Text.h2 textAlign="center">Upgrade complete</Text.h2>
      <Text.p fontSize="1.7rem" color="darkLavender" textAlign="center">
        CDP #{cdp.id} has been successfully upgraded to a Multi-Collateral Dai Vault.{' '}
      </Text.p>
      <Link
        justifySelf="center"
        target="_blank"
        href={etherscanLink(migrationTxHash, network)}
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
      <Card px="l" py="s" width="100%" maxWidth="400px" justifySelf="center">
        <Table width="100%">
          <tbody>
            <Table.tr>
              <Table.td>
                <Text color="darkPurple">Your new Vault ID</Text>
              </Table.td>
              <Table.td textAlign="right">
                <a
                  fontWeight="medium"
                  href={`${OASIS_HOSTNAME}/borrow/${newCdpId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  #{newCdpId}{' '}
                  <img src={blueArrowTopRight} style={{ fill: '#0000EE' }} />
                </a>
              </Table.td>
            </Table.tr>
          </tbody>
        </Table>
      </Card>
      <Grid gridRowGap="s" justifySelf="center">
        {cdps.length > 0 && (
          <Button mt="s" onClick={onReset}>
            Upgrade another CDP
          </Button>
        )}
        <Button variant="secondary-outline" onClick={onClose}>
          Exit
        </Button>
      </Grid>
    </Grid>
  );
}

export default Complete;
