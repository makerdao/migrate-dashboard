import React, { useState } from 'react';
import {
  Text,
  Button,
  Grid,
  Card,
  Box,
  Checkbox
} from '@makerdao/ui-components-core';
import useStore from '../../hooks/useStore';
import { TextBlock } from '../Typography';
import { SAI, DAI, ETH } from '../../maker';

const CHECKBOX_WIDTH = '5rem';

export default ({
  onNext,
  onPrev,
  pethInVaults = [],
  selectedCdps,
  setSelectedCdps
}) => {
  // TODO
  const shutdownRatio = 0.957;
  const currentRatio = 0.98;
  const estimatedRatio = 0.989;

  const toggleSelection = id => {
    if (selectedCdps.includes(id)) {
      return setSelectedCdps(selectedCdps.filter(x => x !== id));
    }
    setSelectedCdps(selectedCdps.concat(id));
  };

  return (
    <Grid maxWidth="912px" gridRowGap="m" px={['s', 0]}>
      <Text.h2 textAlign="center">Redeem Sai CDPs</Text.h2>
      <Text.p
        textAlign="center"
        t="body"
        fontSize="1.8rem"
        m="0 auto"
        display={{ s: 'none', m: 'block' }}
      >
        Select one or more CDPs to redeem their collateral for ETH.
      </Text.p>
      <Grid
        gridTemplateColumns={{ s: 'minmax(0, 1fr)', l: '2fr 1fr' }}
        gridColumnGap="m"
        gridRowGap="s"
        my={{ s: 's', l: 'l' }}
      >
        <Grid
          px="l"
          gridTemplateColumns={`${CHECKBOX_WIDTH} 1fr 1fr 1fr`}
          alignItems="center"
        >
          <span />
          <Text t="subheading">CDP ID</Text>
          <Text t="subheading">PETH Value</Text>
          <Text t="subheading">ETH Value</Text>
        </Grid>
        <span />
        <Box>
          <Grid gridRowGap="s">
            {pethInVaults.map(([id, amount]) => (
              <ListItem
                key={id}
                {...{ id, amount }}
                onChange={() => toggleSelection(id)}
                checked={!!selectedCdps.find(x => x === id)}
              />
            ))}
          </Grid>
        </Box>
        <Card px={{ s: 'm', m: 'l' }} py={{ s: 'm', m: 'l' }}>
          <Grid gridRowGap="m">
            <Grid gridRowGap="xs">
              <TextBlock t="h5" lineHeight="normal">
                PETH:ETH at shutdown
              </TextBlock>
              <TextBlock t="body">1 PETH : {shutdownRatio} ETH</TextBlock>
            </Grid>
            <Grid gridRowGap="xs">
              <TextBlock t="h5" lineHeight="normal">
                PETH:ETH at current time
              </TextBlock>
              <TextBlock t="body">1 PETH : {currentRatio} ETH</TextBlock>
            </Grid>
            <Grid gridRowGap="xs">
              <TextBlock t="h5" lineHeight="normal">
                Estimate of final PETH:ETH once all debt is bitten
              </TextBlock>
              <TextBlock t="body">1 PETH : {estimatedRatio} ETH</TextBlock>
            </Grid>
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
          Cancel
        </Button>
        <Button onClick={onNext} disabled={selectedCdps.length === 0}>
          Continue
        </Button>
      </Grid>
    </Grid>
  );
};

function ListItem({ id, amount, onChange, checked, ...otherProps }) {
  return (
    <Card
      borderColor={checked ? '#1AAB9B' : '#D4D9E1'}
      border={checked ? '2px solid' : '1px solid'}
      {...otherProps}
    >
      <Grid
        px={['s', 'l']}
        py={['s', 'm']}
        gridTemplateColumns={`${CHECKBOX_WIDTH} 1fr 1fr 1fr`}
        alignItems="center"
        onClick={onChange}
      >
        <Checkbox checked={checked} onChange={onChange} />
        <span>{id}</span>
        <span>{amount.toString()}</span>
        <span>TODO ETH</span>
      </Grid>
    </Card>
  );
}
