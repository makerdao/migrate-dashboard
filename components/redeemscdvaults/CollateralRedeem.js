import React from 'react';
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
  Link
} from '@makerdao/ui-components-core';
import { TextBlock } from '../Typography';
import { getColor } from '../../utils/theme';
import round from 'lodash/round';
import { ETH } from '@makerdao/dai';

const CHECKBOX_WIDTH = '2rem';
const CHECKBOX_CONTAINER_WIDTH = '4rem';
const TABLE_COLUMNS = `${CHECKBOX_CONTAINER_WIDTH} 1fr 2fr 2fr`;

export default ({
  onNext,
  onPrev,
  pethInVaults = [],
  selectedCdps,
  setSelectedCdps,
  ratio
}) => {
  const ethValue = amount => ratio ? ETH(amount.times(ratio)).toString(3) : '...';

  const toggleSelection = id => {
    if (selectedCdps.includes(id)) {
      return setSelectedCdps(selectedCdps.filter(x => x !== id));
    }
    setSelectedCdps(selectedCdps.concat(id).sort());
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
      {pethInVaults.length > 0 && (
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
              gridTemplateColumns={TABLE_COLUMNS}
              gridColumnGap="l"
              alignItems="center"
              fontWeight="medium"
              color="steelLight"
              css="white-space: nowrap;"
            >
              <span />
              <Text t="subheading">CDP ID</Text>
              <Text t="subheading">PETH VALUE</Text>
              <Text t="subheading">ETH VALUE</Text>
            </Grid>
          </Box>
          <Box />
        </Grid>
      )}

      <Grid
        gridTemplateColumns={{ s: 'minmax(0, 1fr)', l: '2fr 1fr' }}
        gridGap="m"
        mt={{ s: 'xs', l: 'm' }}
      >
        <Overflow x="scroll" y="visible">
          {pethInVaults.length === 0 && (
            <Card>
              <Flex justifyContent="center" py="l" px="m">
                <Text.p textAlign="center" t="body">
                  You&apos;re all set! There are no redemptions to make using
                  this wallet.
                  <br />
                  <Text.span display={{ s: 'block', m: 'none' }} mt="m" />
                  Please visit us at <Link>chat.makerdao.com</Link> if you have
                  any questions.
                </Text.p>
              </Flex>
            </Card>
          )}
          <Grid gridRowGap="s" pb="m">
            {pethInVaults.map(([id, amount]) => (
              <ListItem
                key={id}
                {...{ id, amount }}
                eth={ethValue(amount)}
                onChange={() => toggleSelection(id)}
                checked={!!selectedCdps.find(x => x === id)}
              />
            ))}
          </Grid>
        </Overflow>
        <Card px={{ s: 'm', m: 'l' }} py={{ s: 'm', m: 'l' }}>
          <Grid gridRowGap="xs">
            <TextBlock t="h5" lineHeight="normal">
              PETH:ETH Ratio (Current)
            </TextBlock>
            <TextBlock t="body">1 PETH : {ratio ? round(ratio, 4) : '...'} ETH</TextBlock>
          </Grid>
        </Card>
      </Grid>
      <Grid
        justifySelf="center"
        gridTemplateColumns="auto auto"
        gridColumnGap="m"
        mt={{ s: 'm', l: 'xl' }}
      >
        <Button variant="secondary-outline" onClick={onPrev}>
          Cancel
        </Button>
        <Button disabled={selectedCdps.length === 0} onClick={onNext}>
          Continue
        </Button>
      </Grid>
    </Grid>
  );
};

function ListItem({ id, amount, eth, onChange, checked, ...otherProps }) {
  const selectable = amount.gt(0);
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
          gridTemplateColumns={TABLE_COLUMNS}
          gridColumnGap="l"
          alignItems="center"
          fontSize="m"
          color="darkPurple"
          css="white-space: nowrap;"
          onClick={selectable ? onChange : () => {}}
        >
          <Checkbox
            onChange={selectable ? onChange : () => {}}
            fontSize={CHECKBOX_WIDTH}
            checked={checked}
            data-testid='cdpCheckbox'
            disabled={!selectable}
          />

          <span>#{id}</span>
          <span>{amount.toString(3)}</span>
          <span>{eth}</span>
        </Grid>
      </Box>
      <Box display={['block', 'none']} onClick={onChange}>
        <Flex py="s" pl="m" alignItems="center">
          <Checkbox
            onChange={onChange}
            fontSize={CHECKBOX_WIDTH}
            checked={checked}
            mr="9px"
          />
          <Text fontSize="20px">CDP {id}</Text>
        </Flex>
        <ListItemRow label="Peth Value" dark>
          {amount.toString(3)}
        </ListItemRow>
        <ListItemRow label="Eth Value">{eth}</ListItemRow>
      </Box>
    </Card>
  );
}

function ListItemRow({ label, children, dark }) {
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      bg={dark ? getColor('lightGrey') : 'white'}
      px="m"
      py="s"
    >
      <Label>{label}</Label>
      <div>{children}</div>
    </Flex>
  );
}

const Label = styled(Box)`
  text-transform: uppercase;
  font-weight: bold;
  font-size: 13px;
  color: ${getColor('steel')};
`;
