import { migrationMaker } from './helpers';

export async function shutDown() {
  const maker = await migrationMaker();
  const top = maker.service('smartContract').getContract('SAI_TOP');
  const normalCdp = await openLockAndDrawScdCdp(maker);
  const proxyCdp = await maker.service('cdp').openProxyCdpLockEthAndDrawDai(
    2,
    20,
    dsProxyAddress
  );
  await top.cage();
  await normalCdp.bite();
  await proxyCdp.bite();
}

async function openLockAndDrawScdCdp(maker) {
  const cdp = await maker.openCdp();
  await cdp.lockEth(1);
  await cdp.drawDai(10);
  return cdp;
}

shutDown();