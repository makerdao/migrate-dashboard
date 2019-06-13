import { useState, useEffect } from 'react'
import { Box, Position } from '@makerdao/ui-components-core'

const transitionDuration = 300

function FlowBackground({ children, open }) {
  const [delayedOpen, setDelayedOpen] = useState(false)

  useEffect(() => {
    // cheap hack to force a render to make sure transitions are played on mount
    setTimeout(() => setDelayedOpen(open))
  }, [open])

  const isActive = delayedOpen

  return <Position position="fixed" top="0" left="0" style={{ pointerEvents: open ? 'unset' : 'none' }}>
    <Box height="100vh" width="100vw" bg="backgroundGrey" opacity={isActive ? 1 : 0} transition={`opacity ${transitionDuration}ms, transform ${transitionDuration}ms ease-in-out`} css={`
      transform: translateX(${isActive ? '0rem' : '3rem'});
      transform-origin: right;
    `}>
      { children }
    </Box>
  </Position>
}

export default FlowBackground
