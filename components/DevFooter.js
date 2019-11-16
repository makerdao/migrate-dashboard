import React from 'react';
import { Grid, Box, Text } from '@makerdao/ui-components-core';
import styled from 'styled-components';
import { getColor } from '../utils/theme';
import useMaker from '../hooks/useMaker';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const [sha, ...rest] = publicRuntimeConfig.lastCommit.split(' ');
const maxMessageLength = 50;
let message = rest.join(' ');
if (message.length > maxMessageLength)
  message = message.substring(0, maxMessageLength - 3) + '...';
const commitUrl = `https://github.com/makerdao/migrate-dashboard/commit/${sha}`;

const Link = styled.a`
  color: ${getColor('steel')};
`;

export default function DevFooter() {
  const { network } = useMaker();
  return (
    <Grid maxWidth="1140px" m="0 auto">
      <Box mt="1em" mb="1em" textAlign={['center', 'right']} t="subheading">
        {network === 'kovan' && <Text mr="l">Kovan</Text>}
        <Link target="_blank" rel="noopener noreferrer" href={commitUrl}>
          <Text>
            {sha}: {message}
          </Text>
        </Link>
      </Box>
    </Grid>
  );
}
