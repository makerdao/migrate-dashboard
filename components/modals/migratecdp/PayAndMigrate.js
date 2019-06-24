import { useState } from 'react'
import {
  Text,
  Grid,
  Table,
  Button,
  Checkbox,
  Link,
  Flex,
  Tooltip,
  Card,
  CardTabs
} from '@makerdao/ui-components-core';

const PayAndMigrate = ({ onPrev, onNext }) => {
  const [hasReadTOS, setHasReadTOS] = useState(false);

  return (
    <Grid maxWidth="912px" gridRowGap="l">
      <Text.h2 textAlign="center">Confirm CDP Migration</Text.h2>
      <CardTabs headers={['Pay with Dai', 'Pay with MKR']}>
        <Grid gridRowGap="m" color="darkPurple" pt="2xs" pb="l" px="l">
          <Table width="100%">
            <Table.tbody>
              <Table.tr>
                <Table.td>
                  <Text>CDP ID</Text>
                </Table.td>
                <Table.td textAlign="right">
                  <Text fontWeight="medium">
                    <Link>3228</Link>
                  </Text>
                </Table.td>
              </Table.tr>
              <Table.tr>
                <Table.td>
                  <Text>
                    Stability Fee
                  </Text>
                </Table.td>
                <Table.td textAlign="right">
                  <Text fontWeight="medium">23.32 DAI</Text>
                </Table.td>
              </Table.tr>
            </Table.tbody>
          </Table>
          <Grid alignItems="center" gridTemplateColumns="auto 1fr">
            <Checkbox
              mr="s"
              fontSize="l"
              checked={hasReadTOS}
              onChange={evt => setHasReadTOS(evt.target.checked)}
            />
            <Text t="caption" color="steel">
              I have read and accept the <Link>Terms of Service</Link>.
            </Text>
          </Grid>
        </Grid>
        <Grid gridRowGap="m" color="darkPurple" pt="2xs" pb="l" px="l">
          <Table width="100%">
            <Table.tbody>
              <Table.tr>
                <Table.td>
                  <Text>CDP ID</Text>
                </Table.td>
                <Table.td textAlign="right">
                  <Text fontWeight="medium">
                    <Link>3228</Link>
                  </Text>
                </Table.td>
              </Table.tr>
              <Table.tr>
                <Table.td>
                  <Text>
                    Stability Fee
                  </Text>
                </Table.td>
                <Table.td textAlign="right">
                  <Text fontWeight="medium">23.32 MKR</Text>
                </Table.td>
              </Table.tr>
            </Table.tbody>
          </Table>
          <Grid alignItems="center" gridTemplateColumns="auto 1fr">
            <Checkbox
              mr="s"
              fontSize="l"
              checked={hasReadTOS}
              onChange={evt => setHasReadTOS(evt.target.checked)}
            />
            <Text t="caption" color="steel">
              I have read and accept the <Link>Terms of Service</Link>.
            </Text>
          </Grid>
        </Grid>
      </CardTabs>
      <Grid
        gridTemplateColumns="auto auto"
        justifyContent="center"
        gridColumnGap="m"
      >
        <Button
          justifySelf="center"
          variant="secondary-outline"
          onClick={onPrev}
        >
          Cancel
        </Button>
        <Button justifySelf="center" disabled={!hasReadTOS} onClick={onNext}>
          Pay and Migrate
        </Button>
      </Grid>
    </Grid>
  );
};

export default PayAndMigrate
