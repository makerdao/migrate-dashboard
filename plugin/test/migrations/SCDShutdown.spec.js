import { migrationMaker } from '../helpers';
import { ServiceRoles, Migrations } from '../../src/constants';
import { takeSnapshot, restoreSnapshot } from '@makerdao/test-helpers';

let maker, migration, snapshotData;

async function shutDownScd() {
  const top = maker.service('smartContract').getContract('SAI_TOP');
  await openLockAndDrawScdCdp();
  await top.cage();
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
    migration = service.getMigration(Migrations.SCD_SHUTDOWN);
    await shutDownScd();
  });

  afterEach(async () => {
    await restoreSnapshot(snapshotData, maker);
  });

  test('shutdown on testnet initiates as expected', async () => {
    const off = await maker.service('smartContract').getContract('SAI_TAP').off();
    expect(off).toBe(true);
  });

  test('should get the exchange rate', async () => {
    // this value seems weird
    const rate = await migration._tap.fix();
    expect(rate).toBeDefined();
  });
});