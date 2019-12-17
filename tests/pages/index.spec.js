import Index from '../../pages';
import render from '../helpers/render';
import {
  fireEvent,
  wait,
} from '@testing-library/react';
const { click } = fireEvent;

test('basic rendering', async () => {
  const { getByText } = await render(<Index />);
  getByText(/Migrate and Upgrade/);
});

test('select trezor', async () => {
  let maker;
  const { getByText } = await render(<Index />,{
    getMaker: m => {
      maker = m;
    }
  });
  await wait(() => expect(maker).toBeTruthy());
  click(getByText(/Trezor/));
  //TODO: ^this is throwing Error: Target container is not a DOM element
  getByText(/Connect your trezor wallet/);
});