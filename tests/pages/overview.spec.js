import Overview from '../../pages/overview';
import render from '../helpers/render';

test('basic rendering', async () => {
  const { getByText } = await render(<Overview />);
  getByText(/Migrate and Upgrade/);
});
