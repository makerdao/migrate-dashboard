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
  Link
} from '@makerdao/ui-components-core';
import { TextBlock } from '../Typography';
import { getColor } from '../../utils/theme';
import round from 'lodash/round';
import { ETH } from '@makerdao/dai';
import sortBy from 'lodash/sortBy';
import useMaker from '../../hooks/useMaker';

const CHECKBOX_WIDTH = '2rem';
const CHECKBOX_CONTAINER_WIDTH = '4rem';
const TABLE_COLUMNS = `${CHECKBOX_CONTAINER_WIDTH} 1fr 2fr 2fr`;

export default ({
  onNext,
  onPrev,
  cdps = [],
  updateCdps,
  selectedCdps,
  setSelectedCdps,
  ratio
}) => {
  const { maker } = useMaker();
  const [biting, setBiting] = useState(-1);

  const ethValue = amount =>
    ratio ? ETH(amount.times(ratio)).toString(3) : '...';

  const toggleSelection = id => {
    if (selectedCdps.includes(id)) {
      return setSelectedCdps(selectedCdps.filter(x => x !== id));
    }
    setSelectedCdps(selectedCdps.concat(id).sort());
  };

  const unbitten = cdps.filter(c => c[2].gt(0)).length;

  const bite = async cdpId => {
    try {
      const op = maker.service('cdp').bite(cdpId);
      setBiting(cdpId);
      await op;
      setBiting(-1);
      updateCdps({ type: 'bite', id: cdpId, maker, recur: updateCdps });
    } catch (err) {
      console.error(err);
      alert('Biting failed; please try again.');
    }
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
      {cdps.length > 0 && (
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
              gridTemplateColumns={TABLE_COLUMNS + (unbitten ? ' 1fr' : '')}
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
        gridGap="s"
        mt={{ s: 'xs', l: 'm' }}
      >
        <Overflow x="scroll" y="visible">
          {cdps.length === 0 && (
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
            {sortBy(cdps, x => x[0]).map(([id, peth, debt]) => (
              <ListItem
                key={id}
                {...{ id, peth, debt, unbitten, bite }}
                eth={ethValue(peth)}
                onChange={() => toggleSelection(id)}
                checked={!!selectedCdps.find(x => x === id)}
                biting={biting === id}
              />
            ))}
          </Grid>
        </Overflow>
        <Box>
          <Card px={{ s: 'm', m: 'l' }} py={{ s: 'm', m: 'l' }}>
            <TextBlock t="h5" lineHeight="normal" mb="s">
              PETH:ETH Ratio (Current)
            </TextBlock>
            <TextBlock t="body">
              1 PETH : {ratio ? round(ratio, 4) : '...'} ETH
            </TextBlock>
          </Card>
        </Box>
      </Grid>
      {unbitten > 0 && (
        <Card
          bg="yellow.100"
          p="m"
          borderColor="yellow.400"
          border="1px solid"
          mt="s"
        >
          {unbitten} CDP{unbitten > 1 ? 's are' : ' is'} not selectable because{' '}
          {unbitten > 1 ? 'they have' : 'it has'} debt. Press the "Bite" button
          to clear a CDP's debt and make it redeemable.
        </Card>
      )}
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

function ListItem({
  id,
  peth,
  debt,
  eth,
  onChange,
  checked,
  unbitten,
  bite,
  biting,
  ...otherProps
}) {
  const selectable = peth.gt(0) && debt.eq(0);
  const select = selectable ? onChange : () => {};
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
          gridTemplateColumns={TABLE_COLUMNS + (unbitten ? ' 1fr' : '')}
          gridColumnGap="l"
          alignItems="center"
          fontSize="m"
          color="darkPurple"
          css="white-space: nowrap;"
          onClick={select}
        >
          <Checkbox
            onChange={select}
            fontSize={CHECKBOX_WIDTH}
            checked={checked}
            data-testid="cdpCheckbox"
            disabled={!selectable}
          />

          <span>#{id}</span>
          <span>{peth.toString(3)}</span>
          <span>{eth}</span>
          {debt.gt(0) && (
            <Button py="xs" px="s" onClick={() => bite(id)} loading={biting}>
              Bite
            </Button>
          )}
        </Grid>
      </Box>
      <Box display={['block', 'none']} onClick={select}>
        <Flex py="s" px="m" alignItems="center">
          <Checkbox
            onChange={select}
            fontSize={CHECKBOX_WIDTH}
            checked={checked}
            disabled={!selectable}
            mr="9px"
          />
          <Text fontSize="20px">CDP {id}</Text>
          {debt.gt(0) && (
            <Box flexGrow="2" textAlign="right">
              <Button py="xs" px="s" onClick={() => bite(id)} loading={biting}>
                Bite
              </Button>
            </Box>
          )}
        </Flex>
        <ListItemRow label="Peth Value" dark>
          {peth.toString(3)}
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
