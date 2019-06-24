import { useEffect } from 'react'
import { Grid, Text, Button, Link } from '@makerdao/ui-components-core'

import arrowTopRight from '../../../assets/icons/arrowTopRight.svg'

function Migrating({ onNext, onReset, onClose }) {
  return (
    <Grid gridRowGap="m">
      <Text.h2 textAlign="center">
        Your CDP is being migrated
      </Text.h2>
      <Text.p fontSize="1.7rem" color="darkLavender">
        The estimated time is 8 minutes. You can safely leave this page and return.
      </Text.p>
      <Button
        justifySelf="center"
        fontSize="s"
        py="xs"
        px="s"
        variant="secondary"
      >
        View transaction details <img src={arrowTopRight}/>
      </Button>

      <Grid gridRowGap="s" justifySelf="center">
        <Button onClick={onReset}>
          Migrate another CDP
        </Button>
        <Button
          variant="secondary-outline"
          onClick={onClose}
        >
          Exit
        </Button>
      </Grid>
      {/* DELETE ME AFTER: */}
      <Link onClick={onNext}>Click me to go next</Link>
    </Grid>
  );
};

export default Migrating
