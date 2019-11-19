import Overview from '../overview';
import render from '../../utils/testing/render';

test('basic rendering', async () => {
  const { getByText } = render(<Overview />);
  getByText(/Migrate and Upgrade/);
});
