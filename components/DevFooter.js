import React, { useEffect, useState } from 'react';
import { Grid, Box, Text } from '@makerdao/ui-components-core';
import versionJson from '../config/version.json';
import styled from 'styled-components';
import { getColor } from '../utils/theme';
import useMaker from '../hooks/useMaker';

const { COMMIT_SHA } = versionJson;
const commitUrl = `https://github.com/makerdao/migrate-dashboard/commit/${COMMIT_SHA}`;
const apiUrl = `https://api.github.com/repos/makerdao/migrate-dashboard/git/commits/${COMMIT_SHA}`;

const Link = styled.a`
  color: ${getColor('steel')};
`;

export default function DevFooter() {
  const [message, setMessage] = useState('...');
  const { network } = useMaker();

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
      <Box mt="1em" mb="1em" textAlign={['center', 'right']} t="subheading">
        {network === 'kovan' && <Text mr="l">Kovan</Text>}
        <Link target="_blank" rel="noopener noreferrer" href={commitUrl}>
          <Text>
            {COMMIT_SHA.substring(0, 6)}: {message}
          </Text>
        </Link>
      </Box>
    </Grid>
  );
}
