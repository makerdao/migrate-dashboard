import { Text } from '@makerdao/ui-components-core'
import styled from 'styled-components';


// TODO - make use of design-system provided constants for font-size
const Title = styled(Text)`
  font-size: 45px;
  font-weight: 500;
  line-height: 54px;
  display: block;
`;

const Subtitle = styled(Text)`
  font-size: 20px;
  letter-spacing: 0.2px;
  line-height: 32px;
  display: block;
`;

const TextBlock = styled(Text)`
  display: block;
`;

const BreakableText = styled(Text)`
  overflow-wrap: break-word;
  word-break: break-word;
`;

export function Breakout({ children, ...props }) {
  return <Text.p fontSize="2rem" color="darkLavender" lineHeight='1.3' letterSpacing="0.3px" mb="m" {...props}>
    { children }
  </Text.p>
}

export { Title, Subtitle, TextBlock, BreakableText };

