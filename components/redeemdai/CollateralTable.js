import {
  Text,
  Box,
  Grid,
  Card,
  Button,
  Tooltip,
  Flex
} from '@makerdao/ui-components-core';
import styled from 'styled-components';
import { getColor } from '../../utils/theme';
import TooltipContents from '../TooltipContents';
import { prettifyNumber } from '../../utils/ui';
import BigNumber from 'bignumber.js';
import SuccessButton from '../SuccessButton';

const TABLE_COLUMNS = '1fr 1fr 2fr 2fr 2fr 2fr';

const Label = styled(Box)`
  text-transform: uppercase;
  font-weight: bold;
  font-size: 13px;
  color: ${getColor('steel')};
`;

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

function ListItem({
    ilk,
    tagData,
    price,
    amount,
    maxRedeem,
    redeemComplete,
    buttonLoading,
    buttonDisabled,
    redeemDai,
    ...otherProps
  }) {
  const ilkMaxRedeem = maxRedeem.find(x => x.ilk === ilk).max;
  const token = ilk.split('-')[0];
  const value = `$${prettifyNumber(
    BigNumber(1).div(tagData.find(t => t.ilk === ilk).price)
  )}`;
  const exchangeRate = `1 DAI : ${prettifyNumber(price, false, 4)} ${token}`;
  const redeeming = amount
    ? `${prettifyNumber(
      price.times(ilkMaxRedeem),
      false,
      price
        .times(ilkMaxRedeem)
        .gt(0.01)
        ? 2
        : 4
      )} ${ilk.split('-')[0]}`
    : '';
  const redeemingDai = amount
    ? `${prettifyNumber(
      ilkMaxRedeem,
      false,
      ilkMaxRedeem.gt(0.01)
        ? 2
        : 4
      )} DAI`
    : '';
  const redemptionButton = redeemComplete.includes(ilk) ||
  ilkMaxRedeem.eq(0) ? (
    <SuccessButton
      py="4px"
      justifySelf="center"

    />
  ) : (
    <Button
      py="4px"
      px="4px"
      mx="16px"
      justifySelf="center"
      width="100%"
      fontSize={'16px'}
      loading={buttonLoading.includes(ilk)}
      disabled={
        buttonDisabled ||
        ilkMaxRedeem.eq(0)
      }
      onClick={() =>
        redeemDai(maxRedeem.find(x => x.ilk === ilk).max, ilk)
      }
    >
      Redeem
    </Button>
  );
  return (
    <Card
      px={['0', 'l']}
      py={['0', 'm']}
      mt={{s: 'm', l: 'xs'}}
      borderColor={'#D4D9E1'}
      border={'1px solid'}
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
        >
          <span>{token}</span>
          <span>{value}</span>
          <span>{exchangeRate}</span>
          <span>{redeeming}</span>
          <span>{redeemingDai}</span>
          {redemptionButton}
        </Grid>
      </Box>
      <Box display={['block', 'none']}>
        <ListItemRow label="Token" dark>
          {token}
        </ListItemRow>
        <ListItemRow label="Value">
          {value}
        </ListItemRow>
        <ListItemRow label="Exchange Rate" dark>
          {exchangeRate}
        </ListItemRow>
        <ListItemRow label="Redeeming">
          {redeeming}
        </ListItemRow>
        <ListItemRow label="Reedeming (DAI)" dark>
          {redeemingDai}
        </ListItemRow>
        <Flex alignItems="center" justifyContent="center" my="m">
          {redemptionButton}
        </Flex>

      </Box>
    </Card>
  );
}

function CollateralTable({
  data,
  tagData,
  amount,
  redeemDai,
  bagBalance,
  outAmounts,
  buttonDisabled,
  buttonLoading,
  redeemComplete
}) {
  const maxRedeem = amount
    ? outAmounts.map(e => {
        return {
          ...e,
          max: BigNumber.min(
            amount.toBigNumber(),
            bagBalance.toBigNumber().minus(e.out)
          )
        };
      })
    : outAmounts;
  return (
    <Grid maxWidth="912px" px={['s', 0]} justifyContent="center">
      <Box display={['none', 'block']}>
        <Grid
          mt="m"
          px="l"
          pb="0"
          gridTemplateColumns={TABLE_COLUMNS}
          gridColumnGap="l"
          alignItems="center"
          fontWeight="medium"
          color="steelLight"
          css="white-space: nowrap;"
        >

          <Flex flexDirection='row' alignItems="center">
            <Text t="subheading">Token</Text>
          </Flex>
          <Flex flexDirection='row' alignItems="center">
            <Text t="subheading">Value</Text>
            <Tooltip
              color="steel"
              fontSize="m"
              ml="2xs"
              content={
                <TooltipContents>
                  Token price at time of shutdown
                </TooltipContents>
              }
            />
          </Flex>
          <Flex flexDirection='row' alignItems="center">
            <Text t="subheading">Exchange Rate</Text>
            <Tooltip
              color="steel"
              fontSize="m"
              ml="2xs"
              content={
                <TooltipContents>
                  {`Amount of token redeemable per 1 DAI, after accounting for
                  the token's proportion of the collateral pool (and any
                  system surplus or deficit if applicable`}
                </TooltipContents>
              }
            />
          </Flex>
          <Flex flexDirection='row' alignItems="center">
            <Text t="subheading">Redeeming</Text>
            <Tooltip
              color="steel"
              fontSize="m"
              ml="2xs"
              content={
                <TooltipContents>
                  Total amount of token to be received
                </TooltipContents>
              }
            />
          </Flex>
          <Flex flexDirection='row' alignItems="center">
            <Text t="subheading">Redeeming (DAI)</Text>
            <Tooltip
              color="steel"
              fontSize="m"
              ml="2xs"
              content={
                <TooltipContents>Dai amount being redeemed</TooltipContents>
              }
            />
          </Flex>
          <span />
        </Grid>
      </Box>
      <Grid gridRowGap="s" pb="m" mt="m">
        {data && data.map(({ ilk, price }, idx) => (
          <ListItem
            key={idx}
            {...{ ilk, price, tagData, amount, maxRedeem, redeemComplete, buttonLoading, buttonDisabled, redeemDai }}
          />
        ))}
      </Grid>
    </Grid>
  );
}

export default CollateralTable;
