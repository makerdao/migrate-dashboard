import React from 'react';
import styled from 'styled-components';
import {
  Text,
  Grid,
  Card,
  Button,
  Radio,
  Overflow,
  Box,
  Flex,
  Loader
} from '@makerdao/ui-components-core';
import { getColor } from '../../utils/theme';
import useStore from '../../hooks/useStore';
import { prettifyNumber } from '../../utils/ui';

const RADIO_WIDTH = '2rem';
const RADIO_CONTAINER_WIDTH = '4rem';
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

function ListItem({ cdp, onSelect, checked, selectable }) {
  return (
    <Card
      px={['0', 'l']}
      py={['0', 'm']}
      borderColor={checked ? '#1AAB9B' : '#D4D9E1'}
      border={checked ? '2px solid' : '1px solid'}
    >
      <Box display={['none', 'block']}>
        <Grid
          gridTemplateColumns={`${RADIO_CONTAINER_WIDTH} 1fr 2fr 2fr 2fr 2fr ${AESTHETIC_ROW_PADDING}`}
          gridColumnGap="l"
          alignItems="center"
          fontSize="m"
          color="darkPurple"
          css={`
            white-space: nowrap;
          `}
          onClick={() => selectable && onSelect(cdp)}
        >
          {selectable ? (
            <Radio
              onChange={() => onSelect(cdp)}
              fontSize={RADIO_WIDTH}
              checked={checked}
            />
          ) : (
            <span></span>
          )}
          <span>{cdp.id}</span>
          {/* Collateralization */}
          <span>{cdp.collateralizationRatio + '%'}</span>
          {/* Debt Value */}
          <span>{cdp.debtValue} DAI</span>
          {/* Fee in DAI */}
          <span>{cdp.govFeeDai} DAI</span>
          {/* Fee in MKR */}
          <span>{cdp.govFeeMKR} MKR</span>
        </Grid>
      </Box>
      <Box
        display={['block', 'none']}
        onClick={() => selectable && onSelect(cdp)}
      >
        <Flex py="s" pl="m" alignItems="center">
          {selectable && (
            <Radio
              onChange={() => onSelect(cdp)}
              fontSize={RADIO_WIDTH}
              checked={checked}
              mr="9px"
            />
          )}
          <Text fontSize="20px">CDP {cdp.id}</Text>
        </Flex>
        <ListItemRow
          label="Current Ratio"
          value={cdp.collateralizationRatio + '%'}
          dark
        />
        <ListItemRow label="Sai Debt" value={cdp.debtValue + ' SAI'} />
        <ListItemRow label="Fee in DAI" value={cdp.govFeeDai + ' DAI'} dark />
        <ListItemRow label="Fee in MKR" value={cdp.govFeeMKR + ' MKR'} />
      </Box>
    </Card>
  );
}

export default ({
  onNext,
  onPrev,
  onSelect,
  cdps,
  loadingCdps,
  selectedCDP
}) => {
  const [{ saiAvailable }] = useStore();

  const isSelectable = cdp =>
    cdp.debtValueExact.gt(20) && cdp.debtValueExact.lt(saiAvailable);

  return (
    <Grid maxWidth="912px" gridRowGap="m" px={['s', 0]}>
      <Text.h2 textAlign="center">Select CDP to upgrade</Text.h2>
      <Text.p
        textAlign="center"
        t="body"
        fontSize="1.8rem"
        maxWidth="610px"
        m="0 auto"
      >
        Select a CDP and pay back the Stability Fee in MKR or debt from your CDP
        to upgrade it to Multi-Collateral Dai and the new Oasis Borrow Portal.
      </Text.p>
      <Card
        bg="yellow.100"
        color="#826318"
        borderColor="yellow.400"
        border="1px solid"
        textAlign="center"
        lineHeight="normal"
        p="m"
      >
        CDPs with less than 20 or more than {prettifyNumber(saiAvailable)} SAI
        of debt cannot be migrated at this time.
        <br />
        For additional information, visit{' '}
        <a
          href="https://chat.makerdao.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          chat.makerdao.com
        </a>
        .
      </Card>
      <Overflow x="scroll" y="visible">
        <Grid gridRowGap="s" pb="m">
          <Box display={['none', 'block']}>
            <Grid
              px="l"
              pt="m"
              pb="0"
              gridTemplateColumns={`${RADIO_CONTAINER_WIDTH} 1fr 2fr 2fr 2fr 2fr ${AESTHETIC_ROW_PADDING}`}
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
              <Text t="subheading">Current Ratio</Text>
              <Text t="subheading">Dai Debt</Text>
              <Text t="subheading">Fee In DAI</Text>
              <Text t="subheading">Fee in MKR</Text>
            </Grid>
          </Box>
          {loadingCdps && (
            <Loader
              mt="2rem"
              mb="2rem"
              display="inline-block"
              size="1.8rem"
              color={getColor('makerTeal')}
              justifySelf="end"
              m="auto"
              bg={getColor('lightGrey')}
            />
          )}
          {cdps.map(cdp => (
            <ListItem
              cdp={cdp}
              checked={selectedCDP === cdp}
              selectable={isSelectable(cdp)}
              key={cdp.id}
              onSelect={onSelect}
            />
          ))}
        </Grid>
      </Overflow>
      <Grid
        justifySelf="center"
        gridTemplateColumns="auto auto"
        gridColumnGap="m"
      >
        <Button variant="secondary-outline" onClick={onPrev}>
          Cancel
        </Button>
        <Button
          disabled={Object.keys(selectedCDP).length === 0}
          onClick={onNext}
        >
          Continue
        </Button>
      </Grid>
    </Grid>
  );
};
