import { useState } from 'react'
import { Box, Text, Card, Button, Grid } from '@makerdao/ui-components-core';
import SuccessButton from '../../SuccessButton'

function DeployProxy({ onPrev, onNext }) {
  const [hasProxy, setHasProxy] = useState(false)
  const [hasAllowance, setHasAllowance] = useState(false)

  return <Box maxWidth="71.8rem">
      <Text.h2 textAlign="center" mb="xl">
        Deploy Proxy and Set Allowance
      </Text.h2>
      <Card px="2xl" py="l" mb="xl">
        <Grid gridRowGap="xs">
          <Text.h4>Deploy proxy</Text.h4>
          <Text.p color="darkLavender" fontSize="l" lineHeight="normal">
            Proxies are used in the CDP Portal to bundle multiple transactions into one, saving transaction time and gas costs. This only has to be done once.
          </Text.p>
          {
            hasProxy ? <SuccessButton/> : <Button
              width="13.0rem"
              mt="xs"
              onClick={() => setHasProxy(true)}
            >
              Setup
            </Button>
          }
        </Grid>
        <Grid gridRowGap="xs" mt="l">
          <Text.h4>Set allowance</Text.h4>
          <Text.p color="darkLavender" fontSize="l" lineHeight="normal">
            This permission allows Maker smart contracts to interact with your ETH. This has to be done once for each new collateral type.
          </Text.p>
          { hasAllowance ? <SuccessButton /> : <Button
              width="13.0rem"
              mt="xs"
              onClick={() => setHasAllowance(true)}
            >
              Confirm
            </Button>}

        </Grid>
      </Card>
      <Grid
        justifySelf="center"
        justifyContent="center"
        gridTemplateColumns="auto auto"
        gridColumnGap="m"
      >
        <Button variant="secondary-outline" onClick={onPrev}>
          Cancel
        </Button>
        <Button onClick={onNext} disabled={!hasProxy || !hasAllowance}>
          Continue
        </Button>
      </Grid>
    </Box>
}

export default DeployProxy
