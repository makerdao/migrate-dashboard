import { Text } from '@makerdao/ui-components-core'

export function Breakout({ children, ...props }) {
  return <Text.p fontSize="2rem" color="darkLavender" lineHeight='1.3' letterSpacing="0.3px" mb="m" {...props}>
    { children }
  </Text.p>
}
