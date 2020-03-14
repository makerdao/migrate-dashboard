import React, { useState } from 'react';
import {
  Grid,
  Card,
  Text,
  Button,
  Checkbox,
  Link
} from '@makerdao/ui-components-core';
import CollateralTable from './CollateralTable';

function ConfirmRedeem({ onPrev, redeemAmount }) {
  const [hasReadTOS, setHasReadTOS] = useState(false);

  return (
    <Grid maxWidth="912px" gridRowGap="m" px={['s', 0]}>
      <Text.h2 textAlign="center">Confirm Transaction</Text.h2>
      <Grid gridTemplateColumns="1fr 1fr 1fr">
        <div />
        <Grid gridRowGap="l" width="567px">
          <Card p="m" borderColor="#D4D9E1" border="1px solid">
            <CollateralTable />
            <Grid
              alignItems="center"
              gridTemplateColumns="auto 1fr"
              px={'m'}
              py={'m'}
            >
              <Checkbox
                mr="s"
                fontSize="l"
                checked={hasReadTOS}
                onChange={() => setHasReadTOS(!hasReadTOS)}
              />
              <Text
                t="caption"
                color="steel"
                data-testid="terms"
                onClick={() => setHasReadTOS(!hasReadTOS)}
              >
                I have read and accept the{' '}
                <Link target="_blank" href="/terms">
                  Terms of Service
                </Link>
                .
              </Text>
            </Grid>
          </Card>
        </Grid>
        <div />
      </Grid>

      <Grid
        justifySelf="center"
        justifyContent="center"
        gridTemplateColumns="auto auto"
        gridColumnGap="m"
      >
        <Button variant="secondary-outline" onClick={onPrev}>
          Cancel
        </Button>
        <Button disabled={!hasReadTOS} onClick={() => null}>
          Convert Dai
        </Button>
      </Grid>
    </Grid>
  );
}

export default ConfirmRedeem;
