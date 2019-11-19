import React, { useState, useEffect } from 'react';
import { Box, Position } from '@makerdao/ui-components-core';

const transitionDuration = 300;

function FlowBackground({ children }) {
  const [delayedOpen, setDelayedOpen] = useState(false);

  useEffect(() => {
    // this avoids a warning about state changes outside of act()
    if (process.env.TESTING) return;

    // cheap hack to force a render to make sure transitions are played on mount
    const timeout = setTimeout(() => setDelayedOpen(true));
    return () => clearTimeout(timeout);
  }, []);

  const isActive = delayedOpen;

  return (
    <Position
      top="0"
      left="0"
      style={{ pointerEvents: open ? 'unset' : 'none' }}
    >
      <Box
        width="100vw"
        bg="lightGrey"
        opacity={isActive ? 1 : 0}
        transition={`opacity ${transitionDuration}ms, transform ${transitionDuration}ms ease-in-out`}
        css={`
          transform: translateX(${isActive ? '0rem' : '3rem'});
          transform-origin: right;
        `}
      >
        {children}
      </Box>
    </Position>
  );
}

export default FlowBackground;
