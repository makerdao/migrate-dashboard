import { useState, useEffect, useCallback } from 'react';
import {
  Text,
  Grid,
  Table,
  Button,
  Checkbox,
  Link,
  CardTabs
} from '@makerdao/ui-components-core';
import { MKR } from '@makerdao/dai-plugin-mcd';
import { MAX_UINT_BN } from '../../utils/constants';
import useMaker from '../../hooks/useMaker';
import LoadingToggle from '../LoadingToggle';

const PayAndMigrate = ({ onPrev, onNext }) => {
  const [hasReadTOS, setHasReadTOS] = useState(false);
  const [mkrApprovePending, setMkrApprovePending] = useState(null);
  const [proxyDetails, setProxyDetails] = useState({});

  const { maker, account } = useMaker();

  const giveProxyMkrAllowance = useCallback(async () => {
    setMkrApprovePending(true);
    try {
      await maker.getToken(MKR).approveUnlimited(proxyDetails.address);
      setProxyDetails(proxyDetails => ({
        ...proxyDetails,
        hasMkrAllowance: true
      }));
    } catch (err) {
      console.log('tx failed', err);
    }
    setMkrApprovePending(false);
  }, [account]);

  useEffect(() => {
    (async () => {
      if (maker) {
        // assuming they have a proxy
        const proxyAddress = await maker.service('proxy').currentProxy();
        const connectedWaleltAllowance = await maker
          .getToken(MKR)
          .allowance(account.address, proxyAddress);
        const proxyHasMkrAllowance = connectedWaleltAllowance.eq(MAX_UINT_BN);
        setProxyDetails({
          hasMkrAllowance: proxyHasMkrAllowance,
          address: proxyAddress
        });
      }
    })();
  }, [maker]);

  return (
    <Grid maxWidth="912px" gridRowGap="l">
      <Text.h2 textAlign="center">Confirm CDP Migration</Text.h2>
      <CardTabs headers={['Pay with MKR']}>
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
                  <Text>Stability Fee</Text>
                </Table.td>
                <Table.td textAlign="right">
                  <Text fontWeight="medium">23.32 DAI</Text>
                </Table.td>
              </Table.tr>
            </Table.tbody>
          </Table>
          <Grid>
            <LoadingToggle
              completeText={'MKR unlocked'}
              loadingText={'Unlocking MKR'}
              defaultText={'Unlock MKR to continue'}
              tokenDisplayName={'MKR'}
              isLoading={mkrApprovePending}
              isComplete={proxyDetails.hasMkrAllowance}
              onToggle={giveProxyMkrAllowance}
              disabled={proxyDetails.hasMkrAllowance}
              data-testid="allowance-toggle"
            />
          </Grid>
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
                  <Text>Stability Fee</Text>
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
        <Button
          justifySelf="center"
          disabled={!hasReadTOS || !proxyDetails.hasMkrAllowance}
          onClick={onNext}
        >
          Pay and Migrate
        </Button>
      </Grid>
    </Grid>
  );
};

export default PayAndMigrate;
