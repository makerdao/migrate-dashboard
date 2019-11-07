import { useState, useCallback, useMemo } from 'react';

import { prettifyFloat } from '../utils/ui';

/**
 * Example schema:
 *  { minFloat: 0, maxFloat: 10, isFloat: true, custom: { isEven: (value) => parseFloat(value) % 2 === 0 } }
 * Custom messages should match any custom or built in validator by key.
 * The validate function should return TRUE when the value is invalid
 */

export default function useValidatedInput(
  initialValue = '',
  validationSchema = {},
  customMessages = {}
) {
  const [value, setValue] = useState(initialValue);
  const [errors, setErrors] = useState('');

  const defaultErrorMessage = () => "Please enter a valid input";

  const defaultValidators = {
    isFloat: {
      validate: value => isNaN(parseFloat(value)),
      message: () => "Please enter a valid number"
    },
    maxFloat: {
      validate: (value, schemaValue) => parseFloat(value) > schemaValue,
      message: (value, schemaValue) =>
        `Amount must be less than ${prettifyFloat(schemaValue, 5)}`
    },
    minFloat: {
      validate: (value, schemaValue) => parseFloat(value) <= schemaValue,
      message: (value, schemaValue) =>
        `Amount must be greater than ${prettifyFloat(schemaValue, 5)}`
    }
  };

  const validators = useMemo(() => {
    const custom = validationSchema.custom || {};
    delete validationSchema.custom;

    const fromDefault = Object.keys(validationSchema).map(key => {
      const defaultValidator = defaultValidators[key];
      if (!defaultValidator)
        throw new Error(
          `Unexpected validation ${key} in validation schema. Valid values are ${Object.keys(
            defaultValidators
          )}`
        );

      return {
        key,
        validate: defaultValidator.validate,
        message: customMessages[key] || defaultValidator.message
      };
    }, {});

    const fromCustom = Object.entries(custom).map(([key, validate]) => {
      return {
        key,
        validate,
        message: customMessages[key] || defaultErrorMessage
      };
    });

    return [...fromDefault, ...fromCustom];
  }, [validationSchema, customMessages]);

  const validate = useCallback(
    value => {
      const errors = validators.reduce((errors, validator) => {
        const schemaValue = validationSchema[validator.key];
        const isInvalid =
          validator.validate(value, schemaValue) && value !== '';

        if (isInvalid) errors.push(validator.message(value, schemaValue));

        return errors;
      }, []);

      return errors.join(', ');
    },
    [validationSchema, customMessages]
  );

  const onChange = useCallback(
    event => {
      const value = event.target.value;
      setErrors(validate(value));
      setValue(value);
    },
    [setValue, setErrors, validate]
  );

  const setValueAndValidate = useCallback(
    (newValue, options = { validate: true }) => {
      if (options.validate) setErrors(validate(newValue));
      setValue(newValue);
    },
    [setValue, setErrors, validate]
  );

  return [value, setValueAndValidate, onChange, errors];
}