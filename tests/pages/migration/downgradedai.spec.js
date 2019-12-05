import DowngradeDai from '../../../pages/migration/sai';
import render from '../../helpers/render';
import { SAI, DAI } from '../../../maker';
import {
  cleanup,
  fireEvent
} from '@testing-library/react';

afterEach(cleanup);

test('basic rendering', async () => {
  const { getByText } = await render(<DowngradeDai />, {
    initialState: {
      daiBalance: DAI(100.789),
      saiAvailable: SAI(1000)
    }
  });
  getByText(/Convert Dai to Sai/);
});

test('not enough DAI', async () => {
  const { getByRole, getByText } = await render(<DowngradeDai />, {
    initialState: {
      daiBalance: DAI(10),
      saiAvailable: SAI(12)
    }
  });

  fireEvent.change(getByRole('textbox'), { target: { value: '11' } });
  getByText('Insufficient Dai balance');
});

test('not enough SAI headroom', async () => {
  const { getByRole, getByText } = await render(<DowngradeDai />, {
    initialState: {
      daiBalance: DAI(12),
      saiAvailable: SAI(10)
    }
  });

  fireEvent.change(getByRole('textbox'), { target: { value: '11' } });
  getByText('Amount exceeds Sai availability');
});
