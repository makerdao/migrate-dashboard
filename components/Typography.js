import { Text } from '@makerdao/ui-components-core';
import styled from 'styled-components';

export const BreakableText = styled(Text)`
  overflow-wrap: break-word;
  word-break: break-word;
`;

export function Breakout({ children, ...props }) {
  return (
    <Text.p
      fontSize="2rem"
      color="darkLavender"
      lineHeight="1.3"
      letterSpacing="0.3px"
      mb="m"
      {...props}
    >
      {children}
    </Text.p>
  );
}
