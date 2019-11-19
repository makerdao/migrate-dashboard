import MigrateCdp from '../../../pages/migration/cdp';
import { act } from '@testing-library/react';
import render from '../../helpers/render';
import { SAI } from '../../../maker';

test('basic rendering', async () => {
  const { getByText } = await render(<MigrateCdp />);
  getByText(/Select a CDP/);
});

test('show different messages depending on saiAvailable value', async () => {
  const { getByText, dispatch } = await render(<MigrateCdp />, {
    initialState: { saiAvailable: SAI(100.789) }
  });

  getByText(/CDPs with less than 20 or more than 100.79 SAI/);

  act(() => dispatch({ type: 'assign', payload: { saiAvailable: SAI(10) } }));
  getByText(/There is not enough Sai available/);
});
