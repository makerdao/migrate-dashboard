import MigrateCdp from '../../../pages/migration/cdp';
import render from '../../helpers/render';
import { instantiateMaker, SAI, DAI } from '../../../maker';
import { ETH } from '@makerdao/dai-plugin-mcd';
import {
  mineBlocks,
  takeSnapshot,
  restoreSnapshot
} from '@makerdao/test-helpers';
import {
  act,
  cleanup,
  fireEvent,
  wait,
  waitForElement
} from '@testing-library/react';

import Maker from '@makerdao/dai';
import McdPlugin from '@makerdao/dai-plugin-mcd';
import BigNumber from 'bignumber.js';
import round from 'lodash/round';
const { change, click } = fireEvent;

async function openLockAndDrawScdCdp(drawAmount, maker, proxyTransfer=true) {
  const cdp = await maker.openCdp();
  await cdp.lockEth((drawAmount * 1.5) / 150);
  await cdp.drawDai(drawAmount);
  const proxy = await maker.service('proxy').currentProxy();
  if (proxyTransfer) await cdp.give(proxy);
  return cdp;
}

async function migrateSaiToDai(amount, maker) {
  const migrationContractAddress = maker
    .service('smartContract')
    .getContract('MIGRATION').address;
  await maker.getToken('SAI').approveUnlimited(migrationContractAddress);
  const daiMigration = maker.service('migration').getMigration('sai-to-dai');
  await daiMigration.execute(SAI(amount));
}

afterEach(cleanup);

test('basic rendering', async () => {
  const { getByText } = await render(<MigrateCdp />);
  getByText(/Select a CDP/);
});

test('show different messages depending on saiAvailable value', async () => {
  const { getByText, dispatch } = await render(<MigrateCdp />, {
    initialState: { saiAvailable: SAI(100.789) }
  });

  getByText(/CDPs with less than 20 or more than 100.79 SAI/);

  act(() => dispatch({ type: 'assign', payload: { saiAvailable: SAI(10) } }));
  getByText(/There is not enough Sai available/);
});

test('not enough SAI', async () => {
  const { getByText } = await render(<MigrateCdp />, {
    initialState: {
      saiAvailable: SAI(10)
    }
  });
  getByText(
    'There is not enough Sai available to migrate CDPs at this time. Please try again later.'
  );
});

describe('with live testchain', () => {
  let maker,
      snapshotData,
      proxyAddress,
      proxyCdp,
      nonProxyCdp,
      lowCdp,
      mcdCdp,
      cdpMigrationCheck,
      cdpManager;

  beforeEach(async () => {
    jest.setTimeout(20000);
    maker = await instantiateMaker('test');
    snapshotData = await takeSnapshot(maker);
    await maker.service('proxy').ensureProxy()
    cdpManager = maker.service('mcd:cdpManager')
    proxyAddress = await maker.service('proxy').currentProxy();

    const address = maker.currentAddress()
    console.log('creating liquidity...');
    await openLockAndDrawScdCdp(50, maker);
    await migrateSaiToDai(50, maker);
    mcdCdp = await cdpManager.openLockAndDraw('ETH-A', ETH(10), DAI(100))

    console.log('creating a CDP to migrate...');
    proxyCdp = await openLockAndDrawScdCdp(25, maker);
    nonProxyCdp = await openLockAndDrawScdCdp(25, maker, false)
    lowCdp = await openLockAndDrawScdCdp(10, maker);


    cdpMigrationCheck = {
      [proxyAddress]: [proxyCdp.id],
    };
  });

  afterEach(async () => {
    await restoreSnapshot(snapshotData, maker);
  });

  test('cdp under 20', async () => {
    cdpMigrationCheck = {
      [proxyAddress]: [lowCdp.id],
    };
    const {
      getAllByTestId,
      queryByRole
    } = await render(<MigrateCdp />, {
      initialState: {
        saiAvailable: SAI(110),
        cdpMigrationCheck,
        maker,
        account: window.maker.currentAddress()
      }
    });
    await waitForElement(() => getAllByTestId('cdpListItem'));
    expect(queryByRole('radio')).toBeNull()
  })

  test('the whole flow MKR Payment w/ Proxy CDP', async () => {
    const {
      getByTestId,
      getAllByTestId,
      getByText,
      getAllByRole,
      debug
    } = await render(<MigrateCdp />, {
      initialState: {
        saiAvailable: SAI(110),
        cdpMigrationCheck,
        maker,
        account: window.maker.currentAddress()
      }
    });

    await wait(() => expect(window.maker).toBeTruthy());

    const address = window.maker.currentAddress();
    expect(address).toEqual(maker.currentAddress());

    await waitForElement(() => getAllByTestId('cdpListItem'));

    const cdpRadio = await waitForElement(() => getAllByRole('radio'))

    // select the cdp
    click(cdpRadio[0])

    // click continue
    getByText('Continue')
    click(getByText('Continue'));

    // pay with MKR
    getByText('Confirm CDP Upgrade')
    const payWithMkr = await waitForElement(() => getByText('Pay with MKR'))
    click(payWithMkr)
    expect(getByText('Pay and Migrate').disabled).toBeTruthy();
    // click(await waitForElement(() => getByTestId('allowance-toggle')))
    // click(await waitForElement(() => getByTestId('tosCheck')))
    // expect(getByText('Pay and Migrate').disabled).toBeFalsey()
    // click(getByText('Pay and Migrate'))
    //
    // // in progress
    // await waitForElement(() => getByText('Your CDP is being upgraded'))
    // await waitForElement(() => getByText('View transaction details'))
    //
    // // complete
    // await waitForElement(() => getByText('Upgrade complete'))
    // await waitForElement(() => getByText('CDP #1 has been successfully upgraded to a Multi-Collateral Dai Vault'))
    //
    // // check using the maker instance that the user now has an MCD CDP
    // const data = await cdpManager.getCdpIds(proxyAddress)
    // expect(data.length).toBeGreaterThan(1)
    // debug();
  });

  // test('the whole flow Dai Payment w/ Proxy CDP', async () => {
  //   const {
  //     getByTestId,
  //     getAllByTestId,
  //     getByText,
  //     debug
  //   } = await render(<MigrateCdp />, {
  //     initialState: {
  //       saiAvailable: SAI(110),
  //       cdpMigrationCheck,
  //       maker,
  //       account: window.maker.currentAddress()
  //     }
  //   });
  //
  //   await wait(() => expect(window.maker).toBeTruthy());
  //
  //   const address = window.maker.currentAddress();
  //   expect(address).toEqual(maker.currentAddress());
  //
  //   await waitForElement(() => getAllByTestId('cdpListItem'));
  //
  //   const cdpRadio = await waitForElement(() => getAllByRole('radio'))
  //
  //   // select the cdp
  //   click(cdpRadio[0])
  //
  //   // click continue
  //   getByText('Continue')
  //   click(getByText('Continue'));
  //
  //   // pay with DAI
  //   getByText('Confirm CDP Upgrade')
  //   const daiDebt = await waitForElement(() => getByText('Pay with CDP debt'))
  //   click(daiDebt)
  //   expect(getByText('Pay and Migrate').disabled).toBeTruthy();
  //   click(getByTestId('tosCheck'))
  //   expect(getByText('Pay and Migrate').disabled).toBeFalsey()
  //   click(getByText('Pay and Migrate'))
  //
  //   // in progress
  //   await waitForElement(() => getByText('Your CDP is being upgraded'))
  //   await waitForElement(() => getByText('View transaction details'))
  //
  //   // complete
  //   await waitForElement(() => getByText('Upgrade complete'))
  //   await waitForElement(() => getByText('CDP #1 has been successfully upgraded to a Multi-Collateral Dai Vault'))
  //
  //   // check using the maker instance that the user now has an MCD CDP
  //   const manager = maker.service('mcd:cdpManager')
  //   const data = await cdpManager.getCdpIds(proxyAddress)
  //   expect(data.length).toBeGreaterThan(1)
  // });

  // test('proxy transfer w/ non proxy-CDP', async () => {
  //   const {
  //     getByTestId,
  //     getAllByTestId,
  //     getByText,
  //     debug
  //   } = await render(<MigrateCdp />, {
  //     initialState: {
  //       saiAvailable: SAI(110),
  //       cdpMigrationCheck,
  //       maker,
  //       account: window.maker.currentAddress()
  //     }
  //   });
  // cdpMigrationCheck = {
  //   [address]: [nonProxyCdp.id]
  // };
  //
  //   await wait(() => expect(window.maker).toBeTruthy());
  //
  //   const address = window.maker.currentAddress();
  //   expect(address).toEqual(maker.currentAddress());
  //
  //   await waitForElement(() => getAllByTestId('cdpListItem'));
  //
  //   const cdpRadio = await waitForElement(() => getAllByRole('radio'))
  //
  //   // select the cdp
  //   click(cdpRadio[0])
  //
  //   // click continue
  //   getByText('Continue')
    // click(getByText('Continue'));
    //
    // transfer cdp to proxy
    // expect(getByText('Continue).disabled).toBeTruthy()
    // getByText('Transfer CDP')
    // click(getByText('Transfer CDP')
    // waitForElement(() => getByText('Transaction Complete'))
    // expect(getByText('Continue).disabled).toBeFalsey()
    // click(getByText('Continue'))
  // });
});
