// import Overview from '../../pages/overview';
// import render from '../helpers/render';
// import { wait } from '@testing-library/react';
// import assert from 'assert';

// test('render and run all checks', async () => {
//   const { findByText } = await render(<Overview />, {
//     getMaker: maker => {
//       maker.service('cdp').getCdpIds = jest.fn(() => []);
//     }
//   });
//   await findByText(/Migrate and Upgrade/);
//   await wait(() => assert(window.maker.currentAddress()));

//   // the old MKR migration should appear, because the testchain snapshot sets up
//   // the default account with old MKR:
//   // https://github.com/makerdao/testchain/blob/dai.js/scripts/deploy-scd#L154
//   await findByText('Redeem Old MKR');
//   expect(window.maker.service('cdp').getCdpIds).toBeCalled();
// });
