import React from 'react';
import { Grid, Text, Button, Card, Table } from '@makerdao/ui-components-core';

import arrowTopRight from '../../assets/icons/arrowTopRight.svg';
import blueArrowTopRight from '../../assets/icons/blueArrowTopRight.svg';

function Complete({ onReset, onClose, selectedCDP: cdp }) {
  return (
    <Grid gridRowGap="m" mx={'s'}>
      <Text.h2 textAlign="center">Upgrade complete</Text.h2>
      <Text.p fontSize="1.7rem" color="darkLavender" textAlign="center">
        You've successfully upgraded your Single-Collateral Dai for
        Multi-Collateral Dai.
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
      <Card>
        <Grid
          gridRowGap="s"
          color="darkPurple"
          px={{ s: 'm' }}
          py={{ s: 'xs' }}
        >
          <Table p={0}>
            <Table.tbody>
              <Table.tr>
                <Table.td>
                  <Text display={'block'}>Sent: Single Collateral Dai</Text>
                  <Text
                    t="heading"
                    display={'block'}
                    fontWeight="bold"
                  >{`foobar`}</Text>
                </Table.td>
              </Table.tr>
              <Table.tr>
                <Table.td>
                  <Text display={'block'}>Exchange Rate</Text>
                  <Text t="heading" display={'block'} fontWeight="bold">
                    1:1
                  </Text>
                </Table.td>
              </Table.tr>
              <Table.tr>
                <Table.td>
                  <Text display={'block'}>Received: Multi Collateral Dai</Text>
                  <Text
                    t="heading"
                    display={'block'}
                    fontWeight="bold"
                  >{`foobar`}</Text>
                </Table.td>
              </Table.tr>
            </Table.tbody>
          </Table>
        </Grid>
      </Card>
      <Grid gridRowGap="s" justifySelf="center">
        <Button mt="s" onClick={onClose}>
          Exit
        </Button>
      </Grid>
    </Grid>
  );
}

export default Complete;
