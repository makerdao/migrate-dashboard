import React, { useState } from 'react';
import { Text, Button, Grid, Card } from '@makerdao/ui-components-core';
import { TOSCheck } from '../migratecdp/PayAndMigrate';

export default ({ onPrev, onNext, selectedCdps, pethInVaults }) => {
  const redeemCdps = () => {};

  const [hasReadTOS, setHasReadTOS] = useState();
  return (
    <Grid maxWidth="600px" gridRowGap="m" px={['s', 0]} minWidth="38rem">
      <Text.h2 textAlign="center" m="s">
        Confirm Transaction
      </Text.h2>
      <Card px="l" py="m">
        <Grid gridTemplateColumns="1fr 1fr 1fr" pb="s" gridColumnGap="m">
          <Text t="subheading">CDP ID</Text>
          <Text t="subheading">PETH Value</Text>
          <Text t="subheading">ETH Value</Text>
        </Grid>
        {selectedCdps.map((id, index) => (
          <Grid
            gridTemplateColumns="1fr 1fr 1fr"
            key={id}
            gridColumnGap="m"
            py="m"
            borderTop={index === 0 ? 'none' : '1px solid #e9e9e9'}
          >
            <span>#{id}</span>
            <span>{pethInVaults.find(x => x[0] === id)[1].toString()}</span>
            <span>TODO ETH</span>
          </Grid>
        ))}
        <TOSCheck {...{ hasReadTOS, setHasReadTOS }} pt='m' />
      </Card>
      <Grid
        justifySelf="center"
        justifyContent="center"
        gridTemplateColumns="auto auto"
        gridColumnGap="m"
      >
        <Button variant="secondary-outline" onClick={onPrev}>
          Back
        </Button>
        <Button disabled={!hasReadTOS} onClick={redeemCdps}>
          Continue
        </Button>
      </Grid>
    </Grid>
  );
};
