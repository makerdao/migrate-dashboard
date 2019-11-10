import React, { useState } from 'react';
import { Text, Button, Grid, Table, Link, Card, Checkbox } from '@makerdao/ui-components-core';
import useStore from '../../hooks/useStore';
import LoadingToggle from '../LoadingToggle';

export default ({
  onNext,
  onPrev
}) => {
  const [hasReadTOS, setHasReadTOS] = useState(false);
  const [{ saiAmountToMigrate }] = useStore();
  const exchangeRate = [1.00, 1.00]
  const saiAmount = parseInt(saiAmountToMigrate).toFixed(2)
  const daiAmount = (saiAmount * exchangeRate[0] / exchangeRate[1]).toFixed(2)

  return (
    <Grid maxWidth="912px" gridRowGap="m" px={['s', 0]} minWidth="38rem">
      <Text.h2 textAlign="center" m="s">
        Confirm Transaction
      </Text.h2>
      <Grid gridRowGap="s">
        <Card>
          <Grid gridRowGap="s" color="darkPurple" px={{ s: "m" }} py={{ s: "xs" }}>
            <Table p={0}>
              <Table.tbody>
                <Table.tr>
                  <Table.td>
                    <Text display={'block'}>Sending</Text>
                    <Text t="heading" display={'block'} fontWeight="bold">{`${saiAmount} Single Collateral Dai`}</Text>
                  </Table.td>
                </Table.tr>
                <Table.tr>
                  <Table.td>
                    <Text display={'block'}>Exchange Rate</Text>
                    <Text t="heading" display={'block'} fontWeight="bold">1:1</Text>
                  </Table.td>
                </Table.tr>
                <Table.tr>
                  <Table.td>
                    <Text display={'block'}>Receiving</Text>
                    <Text t="heading" display={'block'} fontWeight="bold">{`${daiAmount} Multi Collateral Dai`}</Text>
                  </Table.td>
                </Table.tr>
              </Table.tbody>
            </Table>
          </Grid>
        </Card>
        <Card>
        <Grid px={"m"} py={"m"}>
          <LoadingToggle
            completeText={'SAI unlocked'}
            loadingText={'Unlocking SAI'}
            defaultText={'Unlock SAI to continue'}
            tokenDisplayName={'SAI'}
            // isLoading={mkrApprovePending}
            // isComplete={proxyDetails.hasMkrAllowance}
            // onToggle={giveProxyMkrAllowance}
            // disabled={proxyDetails.hasMkrAllowance || !proxyDetails.address}
            data-testid="allowance-toggle"
          />
          </Grid>
        </Card>
        <Card>
          <Grid alignItems="center" gridTemplateColumns="auto 1fr" px={"m"} py={"m"}>
            <Checkbox
              mr="s"
              fontSize="l"
              checked={hasReadTOS}
              onChange={evt => setHasReadTOS(evt.target.checked)}
            />
            <Text
              t="caption"
              color="steel"
              onClick={() => setHasReadTOS(!hasReadTOS)}
            >
              I have read and accept the <Link>Terms of Service</Link>.
            </Text>
          </Grid>
        </Card>
      </Grid>
      <Grid
        justifySelf="center"
        justifyContent="center"
        gridTemplateColumns="auto auto"
        gridColumnGap="m"
      >
        <Button variant="secondary-outline" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={onNext}>
          Continue
        </Button>
      </Grid>
    </Grid>
  );
};
