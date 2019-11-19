import Index from '../../pages';
import render from '../helpers/render';

test('basic rendering', async () => {
  const { getByText } = await render(<Index />);
  getByText(/Migrate and Upgrade/);
});
