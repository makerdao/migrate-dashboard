import { Text, Grid, Table } from '@makerdao/ui-components-core';

const dummyData = [
  { token: 'ETH', value: 195.1432, rate: 0.0338, amount: 54.19 },
  { token: 'OMG', value: 5.1432, rate: 4.2198, amount: 1532.41 },
  { token: 'BAT', value: 15.1932, rate: 0.9438, amount: 21211.21 }
];

function CollateralTable() {
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
          {dummyData.map(({ token, value, rate, amount }, idx) => (
            <Table.tr key={idx}>
              <Table.th>
                <Text.p my="m" fontSize="1.5rem" t="body" fontWeight={400}>
                  {token}
                </Text.p>
              </Table.th>

              <Table.th>
                <Text.p my="m" fontSize="1.5rem" t="body" fontWeight={400}>
                  {`$${value}`}
                </Text.p>
              </Table.th>

              <Table.th>
                <Text.p my="m" fontSize="1.5rem" t="body" fontWeight={400}>
                  {`1 DAI : ${rate} ${token}`}
                </Text.p>
              </Table.th>

              <Table.th>
                <Text.p my="m" fontSize="1.5rem" t="body" fontWeight={400}>
                  {`${amount} ${token}`}
                </Text.p>
              </Table.th>
            </Table.tr>
          ))}
        </Table.tbody>
      </Table>
    </Grid>
  );
}

export default CollateralTable;
