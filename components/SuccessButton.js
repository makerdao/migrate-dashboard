import React from 'react';
import checkmark from '../assets/icons/largeCheckmark.svg';
import { Button, Text } from '@makerdao/ui-components-core';

const SuccessButton = props => {
  return (
    <Button
      variant="primary-outline"
      justifySelf={['center', 'left']}
      width={['26.0rem', '13.0rem']}
      mt="xs"
      disabled
      {...props}
    >
      <img src={checkmark} />
      <Text ml={'s'} display={['inline', 'none']} color="teal.500">
        Transaction Complete
      </Text>
    </Button>
  );
};

export default SuccessButton;
