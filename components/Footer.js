import React from 'react';
import { Box, Text, Grid } from '@makerdao/ui-components-core';
import dot from '../assets/icons/dot.svg';

const Footer = ({ ...props }) => {
  return (
    <Box borderTop="default" minHeight="100%" mt="m" {...props}>
      <Grid
        maxWidth="1090px"
        gridTemplateColumns={{ s: '1fr', m: '1fr 1fr' }}
        m="0 auto"
        px="m"
        py="m"
        gridRowGap="m"
      >
        <Grid
          order={{ s: 2, m: 1 }}
          alignItems="center"
          gridTemplateColumns="repeat(5, auto)"
          gridColumnGap="xs"
          justifySelf={{ s: 'center', m: 'start' }}
        >
          <Text t="caption">Terms</Text> <img src={dot} />{' '}
          <Text t="caption">Privacy Policy</Text> <img src={dot} />{' '}
          <Text t="caption">Status</Text>
        </Grid>
        <Box order={{ s: 1, m: 2 }} justifySelf={{ s: 'center', m: 'end' }}>
          <Text t="caption">© 2019 Maker</Text>
        </Box>
      </Grid>
    </Box>
  );
};

export default Footer;
