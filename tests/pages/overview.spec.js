import Overview from '../../pages/overview';
import render from '../helpers/render';
import { wait, waitForElement } from '@testing-library/react';
import assert from 'assert';

test('render and run all checks', async () => {
  const { getByText } = await render(<Overview />, {
    getMaker: maker => {
      maker.service('cdp').getCdpIds = jest.fn(() => []);
    }
  });
  getByText(/Migrate and Upgrade/);
  await wait(() => assert(window.maker.currentAddress()));

  await waitForElement(() => getByText(/There are no migrations/));
  expect(window.maker.service('cdp').getCdpIds).toBeCalled();
});
