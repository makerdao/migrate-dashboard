import React from 'react';
import {
  Grid,
  Text,
  Button,
  Card,
  Table,
  Link
} from '@makerdao/ui-components-core';
import useStore from '../../hooks/useStore';
import arrowTopRight from '../../assets/icons/arrowTopRight.svg';
import { etherscanLink, prettifyNumber } from '../../utils/ui';
import useMaker from '../../hooks/useMaker';

function Complete({ onClose, txHash }) {
  const { network } = useMaker();

  const [{ saiAmountToRedeem }] = useStore();
  const amount = prettifyNumber(saiAmountToRedeem.toNumber());

  return (
    <Grid gridRowGap="m" mx={'s'}>
      <Text.h2 textAlign="center">Redemption complete</Text.h2>
      <Text.p fontSize="1.7rem" color="darkLavender" textAlign="center">
        You&apos;ve successfully redeemed your Sai for ETH.
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
                  <Text display={'block'}>Sent: Sai</Text>
                  <Text t="heading" display={'block'} fontWeight="bold">
                    {`${amount} SAI`}
                  </Text>
                </Table.td>
              </Table.tr>
              <Table.tr>
                <Table.td>
                  <Text display={'block'}>Exchange Rate</Text>
                  <Text t="heading" display={'block'} fontWeight="bold">
                  // Pass in actual exchange rate
                    1:1
                  </Text>
                </Table.td>
              </Table.tr>
              <Table.tr>
                <Table.td>
                  <Text display={'block'}>Received: ETH</Text>
                  <Text t="heading" display={'block'} fontWeight="bold">
                    {`${amount} ETH`}
                  </Text>
                </Table.td>
              </Table.tr>
            </Table.tbody>
          </Table>
        </Grid>
      </Card>
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
