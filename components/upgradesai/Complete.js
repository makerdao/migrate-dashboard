import React from 'react';
import {
  Grid,
  Text,
  Button,
  Card,
  Table,
  Link
} from '@makerdao/ui-components-core';
import round from 'lodash/round';

import useStore from '../../hooks/useStore';
import arrowTopRight from '../../assets/icons/arrowTopRight.svg';
import { etherscanLink, prettifyNumber, oasisLink } from '../../utils/ui';
import useMaker from '../../hooks/useMaker';

function Complete({ onClose, migrationTxHash }) {
  const { network } = useMaker();
  const [{ saiAmountToMigrate, dsrAnnual }] = useStore();
  const amount = prettifyNumber(saiAmountToMigrate.toNumber());

  return (
    <Grid gridRowGap="m" mx={'s'}>
      <Text.h2 textAlign="center">Exchange complete</Text.h2>
      <Text.p fontSize="1.7rem" color="darkLavender" textAlign="center">
        You&apos;ve successfully exchanged your Single-Collateral Dai for
        Multi-Collateral Dai.
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
                  <Text display={'block'}>Sent: Single-Collateral Sai</Text>
                  <Text t="heading" display={'block'} fontWeight="bold">
                    {`${amount} SAI`}
                  </Text>
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
                  <Text display={'block'}>Received: Multi-Collateral Dai</Text>
                  <Text t="heading" display={'block'} fontWeight="bold">
                    {`${amount} DAI`}
                  </Text>
                </Table.td>
              </Table.tr>
              <Table.tr>
                <Table.td>
                  <Text display={'block'}>Current Dai Savings Rate</Text>
                  <Text t="heading" display={'block'} fontWeight="bold">
                    {round(
                      dsrAnnual
                        .minus(1)
                        .times(100)
                        .toNumber(),
                      2
                    )}{' '}
                    %
                  </Text>
                </Table.td>
              </Table.tr>
            </Table.tbody>
          </Table>
        </Grid>
      </Card>
      <Grid
        justifySelf="center"
        justifyContent="center"
        gridTemplateColumns={['none', 'auto auto']}
        gridColumnGap="m"
      >
        <Grid gridRow={['2', '1']}>
          <Button mt="s" variant="secondary-outline" onClick={onClose}>
            Finish and exit
          </Button>
        </Grid>
        <Grid gridRow={['1', '1']}>
          <Button
            mt="s"
            onClick={() => {
              window.location = oasisLink('/save', network);
            }}
          >
            Earn Savings on your Dai
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Complete;
