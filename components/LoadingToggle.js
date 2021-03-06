import React from 'react';
import { Grid, Text, Loader, Toggle } from '@makerdao/ui-components-core';
import { getColor } from '../utils/theme';

function LoadingToggle({
  defaultText,
  loadingText,
  completeText,
  isLoading,
  isComplete,
  onToggle,
  disabled,
  testId,
  ...props
}) {
  const text = isLoading
    ? loadingText
    : isComplete
    ? completeText
    : defaultText;
  return (
    <Grid alignItems="center" gridTemplateColumns="auto 1fr auto" width={['100vw', 'auto']}{...props} >
      <Text t="body" fontSize={['24px', '16px']}>{text}</Text>
      {isLoading && (
        <Loader
          display="inline-block"
          size="1.8rem"
          color={getColor('makerTeal')}
          mr="xs"
          justifySelf="end"
        />
      )}
      <Toggle
        css={{ opacity: disabled ? 0.4 : 1 }}
        active={isComplete || isLoading}
        onClick={onToggle}
        justifySelf="end"
        data-testid={testId}
        disabled={disabled}
      />
    </Grid>
  );
}

export default LoadingToggle;
