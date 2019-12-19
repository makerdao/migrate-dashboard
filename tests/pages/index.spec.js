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
  const div = document.createElement('DIV');
  div.id = 'modal';
  document.body.appendChild(div);
  await wait(() => expect(maker).toBeTruthy());
  click(getByText(/Trezor/));
  getByText(/Connect your trezor wallet/);
});