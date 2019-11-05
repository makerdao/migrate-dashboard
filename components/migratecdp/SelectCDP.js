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
import { colors } from '@makerdao/design-system-constants';
import { getColor } from '../../utils/theme';
import round from 'lodash/round';

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

function ListItem({ cdp, onSelect, saiAvailable, checked }) {
  return (
    <Card px={['0', 'l']} py={['0', 'm']}>
      <Box display={['none', 'block']}>
        <Grid
          gridTemplateColumns={`${RADIO_CONTAINER_WIDTH} repeat(4, 1fr) ${AESTHETIC_ROW_PADDING}`}
          gridColumnGap="m"
          alignItems="center"
          fontSize="m"
          color="darkPurple"
          css={`
            white-space: nowrap;
          `}
        >
          <Radio
            disabled={cdp.debtValue > saiAvailable}
            onChange={() => onSelect(cdp)}
            fontSize={RADIO_WIDTH}
            checked={checked}
          />
          <span>{cdp.id}</span>
          {/* Collateralization */}
          <span>
            {cdp.collateralizationRatio === 'Infinity'
              ? '---'
              : cdp.collateralizationRatio + '%'}
          </span>
          {/* Debt Value */}
          <span>{cdp.debtValue} DAI</span>
          {/* Fee in DAI */}
          {/* <span>{cdp.govFeeDai} DAI</span> */}
          {/* Fee in MKR */}
          <span>{cdp.govFeeMKR} MKR</span>
        </Grid>
      </Box>
      <Box display={['block', 'none']}>
        <Flex pt="m" pl="m" alignItems="center">
          <Radio
            disabled={cdp.debtValue > saiAvailable}
            onChange={() => onSelect(cdp)}
            fontSize={RADIO_WIDTH}
            mr="9px"
          />
          <Text fontSize="20px">CDP {cdp.id}</Text>
        </Flex>
        <ListItemRow label="Current Ratio" value={cdp.collateralizationRatio} />
        <ListItemRow label="Dai Drawn" value={cdp.debtValue + ' DAI'} dark />
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
  saiAvailable,
  selectedCDP
}) => {
  const hasTooLargeCdp = cdps.some(c => c.debtValue > saiAvailable);

  return (
    <Grid maxWidth="912px" gridRowGap="m" px={['16px', '0']}>
      <Text.h2 textAlign="center">Select CDP to Migrate</Text.h2>
      <Text.p
        textAlign="center"
        t="body"
        fontSize="1.8rem"
        maxWidth="498px"
        m="0 auto"
      >
        Select a CDP and pay back the stability fee in DAI or MKR to migrate it
        to Multi-collateral Dai and the new CDP Portal.
      </Text.p>
      <Overflow x="scroll" y="visible">
        <Grid gridRowGap="s" mt="xs" pb="m">
          <Box display={['none', 'block']}>
            <Grid
              p="l"
              pb="0"
              gridTemplateColumns={`${RADIO_CONTAINER_WIDTH} repeat(4, 1fr) ${AESTHETIC_ROW_PADDING}`}
              gridColumnGap="m"
              alignItems="center"
              fontWeight="medium"
              color="steelLight"
              css={`
                white-space: nowrap;
              `}
            >
              {loadingCdps ? (
                <Loader
                  display="inline-block"
                  size="1.8rem"
                  color={getColor('makerTeal')}
                  justifySelf="end"
                  m="auto"
                  bg={colors.lightGrey}
                />
              ) : (
                <span />
              )}
              <Text t="subheading">CDP ID</Text>
              <Text t="subheading">Current Ratio</Text>
              <Text t="subheading">Dai Debt</Text>
              {/* <Text t="subheading">Fee In DAI</Text> */}
              <Text t="subheading">Fee in MKR</Text>
            </Grid>
          </Box>
          {cdps.map(cdp => (
            <ListItem
              cdp={cdp}
              checked={selectedCDP.id === cdp.id}
              key={cdp.id}
              {...{ onSelect, saiAvailable }}
            />
          ))}
        </Grid>
      </Overflow>
      {hasTooLargeCdp && (
        <Grid color="steelLight" textAlign="center">
          CDPs with more than {round(saiAvailable, 2)} SAI in debt cannot be
          migrated at this time. Please try again later.
        </Grid>
      )}
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
