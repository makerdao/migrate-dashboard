import Index from '../../pages';
import render from '../helpers/render';
import assert from 'assert';
import { wait } from '@testing-library/react';

test('render and get starting data', async () => {
  let state;
  const { getByText } = await render(<Index />, {
    onStateChange: s => {
      state = s;
    }
  });
  getByText(/Migrate and Upgrade/);
  await wait(() => assert(state.saiAvailable));
  getByText(/Sai available for CDP migration/);
});
