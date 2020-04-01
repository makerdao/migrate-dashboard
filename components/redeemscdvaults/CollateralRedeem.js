import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Text,
  Grid,
  Card,
  Button,
  Checkbox,
  Overflow,
  Box,
  Flex,
  Loader
} from '@makerdao/ui-components-core';
import useStore from '../../hooks/useStore';
import { TextBlock } from '../Typography';
import { getColor } from '../../utils/theme';
import { prettifyNumber } from '../../utils/ui';
import { SAI, DAI, PETH } from '../../maker';

const CHECKBOX_WIDTH = '2rem';
const CHECKBOX_CONTAINER_WIDTH = '4rem';
const AESTHETIC_ROW_PADDING = '4rem';

const Label = styled(Box)`
  text-transform: uppercase;
  font-weight: bold;
  font-size: 13px;
  color: ${getColor('steel')};
`;

function ListItemRow({ label, value, dark }) {
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      bg={dark ? getColor('lightGrey') : 'white'}
      px="m"
      py="s"
    >
      <Label>{label}</Label>
      <div>{value}</div>
    </Flex>
  );
}

function ListItem({ id, amount, eth, onChange, checked, ...otherProps }) {
  return (
    <Card
      px={['0', 'l']}
      py={['0', 'm']}
      borderColor={checked ? '#1AAB9B' : '#D4D9E1'}
      border={checked ? '2px solid' : '1px solid'}
      {...otherProps}
    >
      <Box display={['none', 'block']}>
        <Grid
          gridTemplateColumns={`${CHECKBOX_CONTAINER_WIDTH} 1fr 2fr 2fr ${AESTHETIC_ROW_PADDING}`}
          gridColumnGap="l"
          alignItems="center"
          fontSize="m"
          color="darkPurple"
          css={`
            white-space: nowrap;
          `}
        >
          <Checkbox
            onChange={onChange}
            fontSize={CHECKBOX_WIDTH}
            checked={checked}
            data-testid={'cdpCheckbox'}
          />

          <span>{`#${id}`}</span>
          <span>{`${amount.toString()}`}</span>
          <span>{`${eth} ETH`}</span>
        </Grid>
      </Box>
      <Box
        display={['block', 'none']}
        onClick={() => onSelect(cdp)}
      >
        <Flex py="s" pl="m" alignItems="center">
          <Checkbox
            onChange={() => onSelect(cdp)}
            fontSize={CHECKBOX_WIDTH}
            checked={checked}
            mr="9px"
          />
          <Text fontSize="20px">{`CDP ${id}`}</Text>
        </Flex>
        <ListItemRow
          label="Peth Value"
          value={`${amount.toString()}`}
          dark
        />
        <ListItemRow label="Eth Value" value={`${eth} ETH`} />
      </Box>
    </Card>
  );
}

export default ({
  onNext,
  onPrev,
  pethInVaults = [],
  selectedCdps,
  setSelectedCdps
}) => {
  const shutdownRatio = 0.957;
  const currentRatio = 0.98;
  const estimatedRatio = 0.989;

  pethInVaults = [[1556, PETH(40.4485)]]

  const toggleSelection = id => {
    if (selectedCdps.includes(id)) {
      return setSelectedCdps(selectedCdps.filter(x => x !== id));
    }
    setSelectedCdps(selectedCdps.concat(id));
  };

  return (
    <Grid maxWidth="912px" px={['s', 0]}>
      <Text.h2 textAlign="center">Redeem Sai CDPs for Collateral</Text.h2>
      <Text.p
        textAlign="center"
        t="body"
        fontSize="1.8rem"
        m="0 auto"
        mt="s"
        display={{ s: 'none', m: 'block' }}
      >
        Select one or more CDPs to redeem ETH back to your wallet.
      </Text.p>
      <Grid
        gridTemplateColumns={{ s: 'minmax(0, 1fr)', l: '2fr 1fr' }}
        gridGap="m"
        mt={{ s: 's', l: 'xl' }}
      >
        <Box display={['none', 'block']}>
          <Grid
            px="l"
            // pt="m"
            pb="0"
            gridTemplateColumns={`${CHECKBOX_CONTAINER_WIDTH} 0.5fr 1fr 1fr ${AESTHETIC_ROW_PADDING}`}
            gridColumnGap="l"
            alignItems="center"
            fontWeight="medium"
            color="steelLight"
            css={`
              white-space: nowrap;
            `}
          >
            <span />
            <Text t="subheading">CDP ID</Text>
            <Text t="subheading">PETH VALUE</Text>
            <Text t="subheading">ETH VALUE</Text>
          </Grid>
        </Box>
        <Box />
      </Grid>

      <Grid
        gridTemplateColumns={{ s: 'minmax(0, 1fr)', l: '2fr 1fr' }}
        gridGap="m"
        mt={{ s: 'xs', l: 's'}}
      >
        <Overflow x="scroll" y="visible">
          <Grid gridRowGap="s" pb="m">
            {pethInVaults.map(([id, amount]) => (
               <ListItem
                 key={id}
                 {...{ id, amount, eth: amount.toNumber() * currentRatio }}
                 onChange={() => toggleSelection(id)}
                 checked={!!selectedCdps.find(x => x === id)}
               />
             ))}
          </Grid>
        </Overflow>
        <Card px={{ s: 'm', m: 'l' }} py={{ s: 'm', m: 'l' }}>
          <Grid gridRowGap="m">
            <Grid gridRowGap="xs">
              <TextBlock t="h5" lineHeight="normal">
                PETH:ETH (At Shutdown)
              </TextBlock>
              <TextBlock t="body">{`1 PETH : ${shutdownRatio} ETH`}</TextBlock>
            </Grid>
            <Grid gridRowGap="xs">
              <TextBlock t="h5" lineHeight="normal">
                PETH:ETH (Current)
              </TextBlock>
              <TextBlock t="body">{`1 PETH : ${currentRatio} ETH`}</TextBlock>
            </Grid>
            <Grid gridRowGap="xs">
              <Grid>
                <TextBlock t="h5" lineHeight="normal">
                  Estimated PETH:ETH
                </TextBlock>
                <TextBlock t="h5" lineHeight="normal">
                  once all debt is bitten
                </TextBlock>
              </Grid>
              <TextBlock t="body">
                {`1 PETH : ${estimatedRatio} ETH`}
              </TextBlock>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid
        justifySelf="center"
        gridTemplateColumns="auto auto"
        gridColumnGap="m"
        mt={{ s: 'm', l: 'xl'}}
      >
        <Button variant="secondary-outline" onClick={onPrev}>
          Cancel
        </Button>
        <Button
          disabled={Object.keys(selectedCdps).length === 0}
          onClick={onNext}
        >
          Continue
        </Button>
      </Grid>
    </Grid>
  );
};
