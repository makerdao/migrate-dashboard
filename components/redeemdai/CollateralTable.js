import { Text, Grid, Table, Button } from '@makerdao/ui-components-core';
import { prettifyNumber } from '../../utils/ui';
import BigNumber from 'bignumber.js';

function CollateralTable({ data, tagData, amount, redeemDai, bagBalance, outAmounts, buttonDisabled, buttonLoading, redeemComplete }) {
  const maxRedeem = amount ? outAmounts.map(e => {
    return {...e, max: BigNumber.min(amount.toBigNumber(), bagBalance.toBigNumber().minus(e.out))};
  }) : outAmounts;
  return (
    <Grid gridRowGap="s" p="m">
      <Table>
        <Table.thead>
          <Table.tr py="xl" border="0px">
            <Table.th>
              <Text t="subheading">Token</Text>
            </Table.th>
            <Table.th> 
              <Text t="subheading">Value</Text>
            </Table.th>
            <Table.th>
              <Text t="subheading">Exchange Rate</Text>
            </Table.th>
            <Table.th>
              <Text t="subheading">Redeeming</Text>
            </Table.th>
            <Table.th>
              <Text t="subheading">Redeeming (Dai)</Text>
            </Table.th>
          </Table.tr>
        </Table.thead>
        <Table.tbody>
          {data &&
            data.map(({ ilk, price }, idx) => (
              <Table.tr key={idx}>
                <Table.th>
                  <Text.p my="m" fontSize="1.5rem" t="body" fontWeight={400}>
                  {ilk.split('-')[0]}
                  </Text.p>
                </Table.th>

                <Table.th>
                  <Text.p my="m" fontSize="1.5rem" t="body" fontWeight={400}>
                    {`$${prettifyNumber(BigNumber(1).div(tagData.find(t => t.ilk===ilk).price))}`}
                  </Text.p>
                </Table.th>

                <Table.th>
                  <Text.p my="m" fontSize="1.5rem" t="body" fontWeight={400}>
                    {`1 DAI : ${prettifyNumber(price, false, 4)} ${ilk.split('-')[0]}`}
                  </Text.p>
                </Table.th>

                <Table.th>
                  <Text.p my="m" fontSize="1.5rem" t="body" fontWeight={400}>
                    {amount ? `${prettifyNumber(price.times(maxRedeem.find(x => x.ilk===ilk).max))} ${ilk.split('-')[0]}` : ''}
                  </Text.p>
                </Table.th>

                <Table.th>
                  <Text.p my="m" fontSize="1.5rem" t="body" fontWeight={400}>
                    {amount ? `${prettifyNumber(maxRedeem.find(x => x.ilk===ilk).max)} DAI` : ''}
                  </Text.p>
                </Table.th>

                {redeemDai ?
                (<Table.th>
                  <Button
                    px="16px"
                    py="4px"
                    justifySelf="center"
                    fontSize={'13px'}
                    loading={buttonLoading===ilk}
                    disabled={buttonDisabled || redeemComplete.includes(ilk) || maxRedeem.find(x => x.ilk===ilk).max.eq(0)}
                    onClick={() => redeemDai(maxRedeem.find(x => x.ilk===ilk).max, ilk)}
                  >
                    Redeem
                  </Button>
                </Table.th>):(<Table.th/>)}
              </Table.tr>
            ))}
        </Table.tbody>
      </Table>
    </Grid>
  );
}

export default CollateralTable;
