import React from 'react';
import { Grid, Box, Text, Link } from '@makerdao/ui-components-core';
import useMaker from '../hooks/useMaker';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const [sha, ...rest] = publicRuntimeConfig.lastCommit.split(' ');
const maxMessageLength = 50;
let message = rest.join(' ');
if (message.length > maxMessageLength)
  message = message.substring(0, maxMessageLength - 3) + '...';
const commitUrl = `https://github.com/makerdao/migrate-dashboard/commit/${sha}`;

export default function DevFooter() {
  const { network } = useMaker();
  return (
    <Grid maxWidth="1140px" mt="l" m="0 auto">
      <Box mb="s" textAlign={['center', 'right']}>
        {network === 'kovan' && (
          <Text mr="l" fontSize="xs" color="steelLight">
            Kovan
          </Text>
        )}
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={commitUrl}
          css="text-decoration: none"
        >
          <Text fontSize="xs" color="steelLight">
            {sha}: {message}
          </Text>
        </Link>
      </Box>
    </Grid>
  );
}
