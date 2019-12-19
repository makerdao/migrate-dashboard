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

test('select trezor address', async () => {
  let maker;
  const { getByText } = await render(<Index />,{
    getMaker: m => {
      maker = m;
    }
  });
  const div = document.createElement('DIV');
  div.id = 'modal';
  document.body.appendChild(div);
  const mockOpen = jest.fn();
  window.open = mockOpen;
  await wait(() => expect(maker).toBeTruthy());
  click(getByText(/Trezor/));
  getByText(/Connect your trezor wallet/);
  await wait(() => expect(mockOpen.mock.calls.length).toBe(1));
  //mock the trezor call to return a list of fake addresses?
});