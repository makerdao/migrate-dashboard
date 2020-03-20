import { MDAI_1 } from '../index';

export default class GlobalSettlementDaiRedeemer {
  constructor(container) {
    this._container = container;
    return this;
  }

  async check() {
    const smartContract = this._container.get('smartContract');
    const end = smartContract.getContract('MCD_END_1');
    const isInGlobalSettlement = !(await end.live());
    if (!isInGlobalSettlement) return false;

    const address =
      (await this._container.get('proxy').currentProxy()) ||
      this._container.get('accounts').currentAddress();

    const daiBalance = await this._container
      .get('token')
      .getToken(MDAI_1)
      .balance();
    if (daiBalance.lte(0)) return false;

    const cdpManagerAddress = smartContract.getContractAddress('CDP_MANAGER_1');

    //TODO; don't just look at ilks related to the address's Vaults
    const [, , ilks] = await smartContract
      .getContract('GET_CDPS_1')
      .getCdpsDesc(cdpManagerAddress, address);

    const uniqueIlks = [...new Set(ilks)];
    const fixes = await Promise.all(
      uniqueIlks.map(ilk => {
        return end.fix(ilk);
      })
    );

    return fixes.some(fix => fix.gt(0));
  }

  async pack(daiAmount){
    const endAddress = this._container.get('smartContract').getContractAddress('MCD_END_1');
    const daiJoinAddress = this._container.get('smartContract').getContractAddress('MCD_JOIN_DAI');
    return this._container.get('smartContract').getContract('PROXY_ACTIONS_END').pack(
      endAddress,
      daiJoinAddress,
      daiAmount,
      { dsProxy: true }
    );
  }

}
