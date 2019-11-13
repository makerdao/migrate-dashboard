import React from 'react';
import { Grid, Text, Button, Card, Table } from '@makerdao/ui-components-core';

import arrowTopRight from '../../assets/icons/arrowTopRight.svg';
import useStore from '../../hooks/useStore';
import { prettifyNumber } from '../../utils/ui';

function Complete({ onClose }) {
  const [{ saiAmountToMigrate }] = useStore();
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
                  >{`${prettifyNumber(saiAmountToMigrate)} SAI`}</Text>
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
                  >{`${prettifyNumber(saiAmountToMigrate)} DAI`}</Text>
                </Table.td>
              </Table.tr>
            </Table.tbody>
          </Table>
        </Grid>
      </Card>
        <Button mt="s" onClick={onClose} width={['26.0rem', '13.0rem']} justifySelf={'center'}>
          Exit
        </Button>
    </Grid>
  );
}

export default Complete;
