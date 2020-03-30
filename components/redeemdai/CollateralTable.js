import { Text, Grid, Table, Button } from '@makerdao/ui-components-core';
import { prettifyNumber } from '../../utils/ui';
import BigNumber from 'bignumber.js';

function CollateralTable({ data, tagData, amount, redeemDai, buttonDisabled, buttonLoading, redeemComplete }) {
  return (
    <Grid gridRowGap="s" p="m">
      <Table>
        <Table.thead>
          <Table.tr py="xl" border="0px">
            <Table.th>
              <Text t="subheading">Token</Text>
            </Table.th>
            <Table.th> 
              <Text t="subheading">Shutdown Value</Text>
            </Table.th>
            <Table.th>
              <Text t="subheading">Exchange Rate</Text>
            </Table.th>
            <Table.th>
              <Text t="subheading">Amount</Text>
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
                    {amount ? `${prettifyNumber(price.times(amount.toBigNumber()))} ${ilk.split('-')[0]}` : ''}
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
                    disabled={buttonDisabled || redeemComplete.includes(ilk)}
                    onClick={() => redeemDai(ilk)}
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
