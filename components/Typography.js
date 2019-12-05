import { Text, Card } from '@makerdao/ui-components-core';
import styled from 'styled-components';

export const BreakableText = styled(Text)`
  overflow-wrap: break-word;
  word-break: break-word;
`;

export function Breakout({ children, ...props }) {
  return (
    <Text.p
      fontSize="1.9rem"
      color="darkLavender"
      lineHeight="1.4"
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
  background: #fdede8;
  border-color: #f77249;
  padding: 18px;
  text-align: center;
`;
