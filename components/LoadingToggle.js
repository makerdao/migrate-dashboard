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
  reverse,
  ...props
}) {
  const text = isLoading
    ? loadingText
    : isComplete
      ? completeText
      : defaultText;

  // TODO make this better & account for Loader
  const textOrder = reverse ? 2 : 1;
  const toggleOrder = reverse ? 1 : 2;
  return (
    <Grid alignItems="center" gridTemplateColumns="auto 1fr auto" {...props}>
      <Text t="body" css={{ order: textOrder }}>{text}</Text>
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
        css={{ order: toggleOrder, opacity: disabled ? 0.4 : 1 }}
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
