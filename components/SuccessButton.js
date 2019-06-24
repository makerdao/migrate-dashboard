import checkmark from '../assets/icons/largeCheckmark.svg'
import { Button } from '@makerdao/ui-components-core'

const SuccessButton = () => {
  return (
    <Button variant="primary-outline" width="13.0rem" mt="xs" disabled>
      <img src={checkmark} />
    </Button>
  );
};

export default SuccessButton
