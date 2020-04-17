import React, { useState } from 'react';
import { Grid, Card, Input, Link } from '@makerdao/ui-components-core';
import { TextBlock } from './Typography';

export default function ({
  title,
  children,

  // a Currency class like SAI or DAI
  unit,

  // the maximum allowable value, as an instance of `unit`
  max,

  // a function that gets one argument: the input, typed to the `unit` class. it
  // should return an error message if the value is invalid, and nothing if it's
  // valid
  validate,

  // this will be called with the final typed value if validation passes
  update
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

    if (isNaN(parseFloat(value)))
      return setError('Please enter a valid number');

    let newError;
    try {
      const typedValue = unit(value);
      newError = validate(typedValue);
      if (!newError) update(typedValue);
    } catch (e) {
      newError = e.message;
    }

    setError(newError);
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
