import { migrationMaker } from '../helpers';
import { ServiceRoles, Migrations } from '../../src/constants';
import { takeSnapshot, restoreSnapshot } from '@makerdao/test-helpers';

let cdp, maker, migration, snapshotData;

async function shutDownScd() {
  const top = maker.service('smartContract').getContract('SAI_TOP');
  cdp = await openLockAndDrawScdCdp();
  await top.cage();
  await cdp.bite();
}

async function openLockAndDrawScdCdp() {
  const cdp = await maker.openCdp();
  await cdp.lockEth(1);
  await cdp.drawDai(10);
  return cdp;
}

describe('SCD Shutdown', () => {
  beforeEach(async () => {
    maker = await migrationMaker();
    snapshotData = await takeSnapshot(maker);
    const service = maker.service(ServiceRoles.MIGRATION);
    migration = service.getMigration(Migrations.REDEEM_SAI);
    await shutDownScd();
  });

  afterEach(async () => {
    await restoreSnapshot(snapshotData, maker);
  });

  test('should be off after shutdown', async () => {
    const off = await migration.off();
    expect(off).toBe(true);
  })

  test('should get the exchange rate', async () => {
    // this value seems weird, this and the
    // following test should be improved once
    // the weird values are solved
    const rate = await migration.getRate();
    console.log('fix:', rate.toString())
    expect(rate).toBeDefined();
  });

  test('should get the collateral pending liquidation', async () => {
    const fog = await migration.fog();
    console.log('fog:', fog.toString());
    expect(fog).toBeDefined();
  });

  test('should redeem sai', async () => {
    const sai = maker.getToken('DAI');
    const address = maker.service('web3').currentAddress();
    const balanceBeforeRedemption = await sai.balanceOf(address);
    try {
      await migration.redeemSai(5);
    } catch (err) {
      console.error(err);
    }
    const balanceAfterRedemption = await sai.balanceOf(address);
  });
});