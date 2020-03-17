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
            {/* <Table.th> */}
            {/*   <Text t="subheading">Shutdown Value</Text> */}
            {/* </Table.th> */}
            <Table.th>
              <Text t="subheading">Exchange Rate</Text>
            </Table.th>
            {/* <Table.th> */}
            {/*   <Text t="subheading">Amount</Text> */}
            {/* </Table.th> */}
          </Table.tr>
        </Table.thead>
        <Table.tbody>
          {data &&
            data.map(({ ilk, price }, idx) => (
              <Table.tr key={idx}>
                <Table.th>
                  <Text.p my="m" fontSize="1.5rem" t="body" fontWeight={400}>
                    {ilk}
                  </Text.p>
                </Table.th>

                <Table.th>
                  <Text.p my="m" fontSize="1.5rem" t="body" fontWeight={400}>
                    {`1 DAI : ${price} ${ilk.split('-')[0]}`}
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
