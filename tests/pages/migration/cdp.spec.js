import MigrateCdp from '../../../pages/migration/cdp';
import { act } from '@testing-library/react';
import render from '../../helpers/render';
import { instantiateMaker, SAI, DAI } from '../../../maker';
import { ETH } from '@makerdao/dai-plugin-mcd'
import {
  cleanup,
  fireEvent,
  wait,
  waitForElement
} from '@testing-library/react'

import Maker from '@makerdao/dai'
import McdPlugin from '@makerdao/dai-plugin-mcd'
import BigNumber from 'bignumber.js'
import round from 'lodash/round'
const { change, click } = fireEvent;

afterEach(cleanup)

test('basic rendering', async () => {
  const { getByText } = await render(<MigrateCdp />);
  getByText(/Select a CDP/);
});

/*test('show different messages depending on saiAvailable value', async () => {
  const { getByText, dispatch } = await render(<MigrateCdp />, {
    initialState: { saiAvailable: SAI(100.789) }
  });

  getByText(/CDPs with less than 20 or more than 100.79 SAI/);

  act(() => dispatch({ type: 'assign', payload: { saiAvailable: SAI(10) } }));
  getByText(/There is not enough Sai available/);
});
*/
test('not enough SAI', async () => {
  const { getByRole, getByText } = await render(<MigrateCdp />, {
    initialState: {
      saiAvailable: SAI(10)
    }
  })
  getByText(`There is not enough Sai available to migrate CDPs at this time. Please try again later.`)
})

describe('with live testchain', () => {
  let maker;
  let cdps = [];

  beforeEach(async () => {
    maker = await instantiateMaker('test')
    const proxy = await maker.service('proxy').ensureProxy()
    // create a cdp
    await maker.service('cdp').openProxyCdpLockEthAndDrawDai(10, 1000, proxy)
    // create sai liquidity for migration contract
    // await maker.service('cdp').openProxyCdpLockEthAndDrawDai(20, 2000, proxy)
    const migrationContractAddress = maker
      .service('smartContract')
      .getContract('MIGRATION').address
    await maker.getToken('SAI').approveUnlimited(migrationContractAddress)
    const mig = maker.service('migration').getMigration('sai-to-dai');
    await mig.execute(SAI(2000))

    saiAvailable = await maker.getToken('SAI').balance();
    daiAvailable = await maker.getToken('DAI').balance();
    console.log(saiAvailable.toNumber(), daiAvailable.toNumber())



  })

  test('the whole flow', async () => {
    // const { getByText, getByRole, getByTestId } = await render(<MigrateCdp />, {
    //   initialState: {
    //
    //   }
    // })
  })
})
