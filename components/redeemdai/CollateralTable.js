import { Text, Grid, Table } from '@makerdao/ui-components-core';

function CollateralTable({ data }) {
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
            data.map(({ token, value, rate, amount }, idx) => (
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
