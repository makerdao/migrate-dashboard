import React, { useState } from 'react';
import { Grid, Card, Input, Link } from '@makerdao/ui-components-core';
import { TextBlock } from './Typography';

export default function({
  max,
  unit,
  title,
  update,
  setValid,
  getErrorMessage,
  children
}) {
  const [error, setError] = useState();
  const [value, setValue] = useState('');

  const setMax = () => {
    setValue(max.toBigNumber().toString());
    update(max);
  };

  const onChange = event => {
    const { value } = event.target;
    setValue(value);

    if (isNaN(parseFloat(value))) {
      setError('Please enter a valid number');
      setValid(false);
      return;
    }

    let newError;
    try {
      const typedValue = unit(value);
      newError = getErrorMessage(typedValue);
      if (!newError) update(typedValue);
    } catch (e) {
      newError = e.message;
    }

    setError(newError);
    setValid(!newError);
  };

  return (
    <Card px={{ s: 'm', m: 'l' }} py={{ s: 'm', m: 'l' }}>
      <Grid gridRowGap="m">
        <TextBlock t="h5" lineHeight="normal">
          {title}
        </TextBlock>
        <Input
          type="number"
          value={value}
          placeholder={unit(0).toString()}
          onChange={onChange}
          failureMessage={error}
          after={
            <Link color="blue" fontWeight="medium" onClick={setMax}>
              Set max
            </Link>
          }
        />
        <Grid gridRowGap="xs">{children}</Grid>
      </Grid>
    </Card>
  );
}
