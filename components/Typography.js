import { Text, Card } from '@makerdao/ui-components-core';
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

export const TextBlock = styled(Text)`
  display: block;
`;

export const ErrorBlock = styled(Card)`
  max-width: 347px;
  font-size: 14px;
  color: #994126;
  background: #FDEDE8;
  border-color: #F77249;
  padding: 18px;
  text-align: center;
`;