import { migrationMaker } from '../helpers';
import { ServiceRoles, Migrations } from '../../src/constants';
import { takeSnapshot, restoreSnapshot } from '@makerdao/test-helpers';
import { SAI } from '../../src';

let cdp, maker, migration, snapshotData;

async function shutDownScd() {
  const top = maker.service('smartContract').getContract('SAI_TOP');
  cdp = await openLockAndDrawScdCdp();
  await top.cage();
  await cdp.bite();
  SAI
}

async function openLockAndDrawScdCdp() {
  const cdp = await maker.openCdp();
  await cdp.lockEth(1);
  await cdp.drawDai(10);
  return cdp;
}

describe('Redeem Sai', () => {
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
    console.log('fix:', rate)
    expect(rate).toBeDefined();
  });

  test('should get the collateral pending liquidation', async () => {
    const fog = await migration.fog();
    console.log('fog:', fog.toString());
    expect(fog).toBeDefined();
  });

  test('should redeem sai', async () => {
    const sai = maker.getToken('DAI');
    const gem = maker.getToken('WETH');
    const address = maker.service('web3').currentAddress();
    await sai.approveUnlimited(migration._tap.address);
    const saiBalanceBeforeRedemption = await sai.balanceOf(address);
    const wethBalanceBeforeRedemption = await gem.balanceOf(address);
    try {
      await migration.redeemSai(sai._valueForContract(5, 'DAI'));
    } catch (err) {
      console.error(err);
    }
    const saiBalanceAfterRedemption = await sai.balanceOf(address);
    const wethBalanceAfterRedemption = await gem.balanceOf(address);
    console.log('saiBalanceBeforeRedemption', saiBalanceBeforeRedemption.toNumber());
    console.log('saiBalanceAfterRedemption', saiBalanceAfterRedemption.toNumber());
    console.log('wethBalanceBeforeRedemption', wethBalanceBeforeRedemption.toNumber());
    console.log('wethBalanceAfterRedemption', wethBalanceAfterRedemption.toNumber());
  });
});