import React from 'react';
import {
  Grid,
  Text,
  Button,
  Card,
  Table,
  Link
} from '@makerdao/ui-components-core';

import arrowTopRight from '../../assets/icons/arrowTopRight.svg';

function Complete({ onReset, onClose, selectedCDP: cdp }) {
  return (
    <Grid gridRowGap="m">
      <Text.h2 textAlign="center">Migration complete</Text.h2>
      <Text.p fontSize="1.7rem" color="darkLavender" textAlign="center">
        CDP {cdp.id} has been successfully migrated to Multi-collateral Dai.{' '}
        <a
          href={`https://oasis.app/borrow/${cdp.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Oasis
        </a>
      </Text.p>
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
      <Card px="l" py="s" width="100%" maxWidth="400px" justifySelf="center">
        <Table width="100%">
          <tbody>
            <Table.tr>
              <Table.td>
                <Text color="darkPurple">CDP ID</Text>
              </Table.td>
              <Table.td textAlign="right">
                <Link fontWeight="medium">{cdp.id}</Link>
              </Table.td>
            </Table.tr>
            <Table.tr>
              <Table.td>
                <Text color="darkPurple">Stability Fee paid</Text>
              </Table.td>
              <Table.td textAlign="right">
                <Text fontWeight="medium" color="darkPurple">
                  {cdp.govFeeMKR} MKR
                </Text>
              </Table.td>
            </Table.tr>
          </tbody>
        </Table>
      </Card>
      <Grid gridRowGap="s" justifySelf="center">
        <Button mt="s" onClick={onReset}>
          Migrate another CDP
        </Button>
        <Button variant="secondary-outline" onClick={onClose}>
          Exit
        </Button>
      </Grid>
    </Grid>
  );
}

export default Complete;
