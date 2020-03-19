import useMaker from '../../hooks/useMaker';
import FlowBackground from '../../components/FlowBackground';
import { Grid, Flex } from '@makerdao/ui-components-core';
import FlowHeader from '../../components/FlowHeader';

export default function() {
  const { account } = useMaker();

  return (
    <FlowBackground>
      <Grid>
        <FlowHeader account={account} />
        <Flex position="relative" justifyContent="center">
          TODO show form
        </Flex>
      </Grid>
    </FlowBackground>
  );
}
