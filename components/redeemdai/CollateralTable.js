import {
  Text,
  Grid,
  Table,
  Button,
  Tooltip
} from '@makerdao/ui-components-core';
import TooltipContents from '../TooltipContents';
import { prettifyNumber } from '../../utils/ui';
import BigNumber from 'bignumber.js';
import SuccessButton from '../SuccessButton';

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
    <Grid gridRowGap="s" p="m">
      <Table>
        <Table.thead>
          <Table.tr py="xl" border="0px">
            <Table.th>
              <Text t="subheading">Token</Text>
              <Tooltip style={{ visibility: 'hidden' }} fontSize="m" content={<div/>} />
            </Table.th>
            <Table.th>
              <Text t="subheading">Price</Text>
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
            </Table.th>
            <Table.th>
              <Text t="subheading">Exchange Rate</Text>
              <Tooltip
                color="steel"
                fontSize="m"
                ml="2xs"
                content={
                  <TooltipContents>
                    Amount of token redeemable per 1 DAI, after accounting for
                    the token's proportion of the collateral pool (and any
                    system surplus or deficit if applicable)
                  </TooltipContents>
                }
              />
            </Table.th>
            <Table.th>
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
            </Table.th>
            <Table.th>
              <Text t="subheading">Redeeming (Dai)</Text>
              <Tooltip
                color="steel"
                fontSize="m"
                ml="2xs"
                content={
                  <TooltipContents>Dai amount being redeemed</TooltipContents>
                }
              />
            </Table.th>
          </Table.tr>
        </Table.thead>
        <Table.tbody>
          {data &&
            data.map(({ ilk, price }, idx) => (
              <Table.tr key={idx}>
                <Table.td>
                  <Text.p my="m" fontSize="1.5rem" t="body" fontWeight={400}>
                    {ilk.split('-')[0]}
                  </Text.p>
                </Table.td>

                <Table.td>
                  <Text.p my="m" fontSize="1.5rem" t="body" fontWeight={400}>
                    {`$${prettifyNumber(
                      BigNumber(1).div(tagData.find(t => t.ilk === ilk).price)
                    )}`}
                  </Text.p>
                </Table.td>

                <Table.td>
                  <Text.p my="m" fontSize="1.5rem" t="body" fontWeight={400}>
                    {`1 DAI : ${prettifyNumber(price, false, 4)} ${
                      ilk.split('-')[0]
                    }`}
                  </Text.p>
                </Table.td>

                <Table.td>
                  <Text.p my="m" fontSize="1.5rem" t="body" fontWeight={400}>
                    {amount
                      ? `${prettifyNumber(
                          price.times(maxRedeem.find(x => x.ilk === ilk).max),
                          false,
                          price
                            .times(maxRedeem.find(x => x.ilk === ilk).max)
                            .gt(0.01)
                            ? 2
                            : 4
                        )} ${ilk.split('-')[0]}`
                      : ''}
                  </Text.p>
                </Table.td>

                <Table.td>
                  <Text.p my="m" fontSize="1.5rem" t="body" fontWeight={400}>
                    {amount
                      ? `${prettifyNumber(
                          maxRedeem.find(x => x.ilk === ilk).max,
                          false,
                          maxRedeem.find(x => x.ilk === ilk).max.gt(0.01)
                            ? 2
                            : 4
                        )} DAI`
                      : ''}
                  </Text.p>
                </Table.td>
                <Table.td>
                  {redeemComplete.includes(ilk) ||
                  maxRedeem.find(x => x.ilk === ilk).max.eq(0) ? (
                    <SuccessButton
                      px="16px"
                      py="4px"
                      width="90px"
                      justifySelf="center"
                    />
                  ) : (
                    <Button
                      px="16px"
                      py="4px"
                      width="90px"
                      justifySelf="center"
                      fontSize={'13px'}
                      loading={buttonLoading.includes(ilk)}
                      disabled={
                        buttonDisabled ||
                        maxRedeem.find(x => x.ilk === ilk).max.eq(0)
                      }
                      onClick={() =>
                        redeemDai(maxRedeem.find(x => x.ilk === ilk).max, ilk)
                      }
                    >
                      Redeem
                    </Button>
                  )}
                </Table.td>
              </Table.tr>
            ))}
        </Table.tbody>
      </Table>
    </Grid>
  );
}

export default CollateralTable;
