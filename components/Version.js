import React, { useEffect, useState } from 'react';
import { Grid, Box, Text } from '@makerdao/ui-components-core';
import versionJson from '../config/version.json';
import styled from 'styled-components';
import theme from '../utils/theme';

const { COMMIT_SHA } = versionJson;
const commitUrl = `https://github.com/makerdao/migrate-dashboard/commit/${COMMIT_SHA}`;
const apiUrl = `https://api.github.com/repos/makerdao/migrate-dashboard/git/commits/${COMMIT_SHA}`;

const Link = styled.a`
  color: ${theme.colors.steel};
`;

export default function Version() {
  const [message, setMessage] = useState('...');

  useEffect(() => {
    (async () => {
      try {
        const rawJson = await fetch(apiUrl);
        const commitObj = await rawJson.json();
        setMessage(commitObj.message.split('\n')[0]);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <Grid maxWidth="1140px" m="0 auto">
      <Box mt='1em' mb='1em' textAlign='right'>
        <Text t="subheading">
          <Link target="_blank" rel="noopener noreferrer" href={commitUrl}>
            {COMMIT_SHA.substring(0, 6)}: {message}
          </Link>
        </Text>
      </Box>
    </Grid>
  );
}
