import BigNumber from 'bignumber.js';
import { RAY } from '../constants';

export default class GlobalSettlementCollateralClaims {
  constructor(container) {
    console.log('global settlement works');
    this._container = container;
    return this;
  }

  async check() {
    console.log('global settlement CHECK works3');
    const end = this._container.get('smartContract').getContract('MCD_END');
    const isInGlobalSettlement = (await end.live());
    console.log('end', end);
    if (!isInGlobalSettlement) return false;

    const address =
      (await this._container.get('proxy').currentProxy()) ||
      this._container.get('accounts').currentAddress();

    console.log('address', address);

    const cdpManager = this._container
      .get('smartContract')
      .getContract('CDP_MANAGER');
    const vat = this._container.get('smartContract').getContract('MCD_VAT');

    const cdps = await this._container
      .get('smartContract')
      .getContract('GET_CDPS')
      .getCdpsDesc(cdpManager.address, address);
    // console.log('cdps', ids, ilks, x);

    // return cdps;

    const {ids, ilks} = cdps;
    console.log(cdps, ids, ilks);
    const freeCollateral = await Promise.all(
      ids.map(async (id, i) => {
        const urn = await cdpManager.urns(id);
        const vatUrn = await vat.urns(ilks[i], urn);
        // const skim = await end.skim(ilk, urn);
        const tag = await end.tag(ilks[i]);
        const ilk = await vat.ilks(ilks[i]);

        //function skim(bytes32 ilk, address urn) external note {

        const owed = new BigNumber(vatUrn.art)
          .times(ilk.rate)
          .div(RAY)
          .times(tag)
          .div(RAY);

        const redeemable = tag.gt(0) && new BigNumber(vatUrn.ink).minus(owed).gt(0);
        return { id, owed, redeemable, ilk, urn };
      })
    );


    console.log('freeCollateral', freeCollateral);

    return freeCollateral;
  }

  freeEth(cdpId) {
    const cdpManagerAddress = this._container.get('smartContract').getContractAddress('CDP_MANAGER');
    const endAddress = this._container.get('smartContract').getContractAddress('MCD_END');
    const ethJoinAddress = this._container.get('smartContract').getContractAddress('MCD_JOIN_ETH_A');
    return this._container.get('smartContract').getContract('PROXY_ACTIONS_END').freeETH(
      cdpManagerAddress,
      ethJoinAddress,
      endAddress,
      cdpId,
      { dsProxy: true }
    );
  }

  freeBat(cdpId) {
    const cdpManagerAddress = this._container.get('smartContract').getContractAddress('CDP_MANAGER');
    const endAddress = this._container.get('smartContract').getContractAddress('MCD_END');
    const gemJoinAddress = this._container.get('smartContract').getContractAddress('MCD_JOIN_BAT_A');
    return this._container.get('smartContract').getContract('PROXY_ACTIONS_END').freeGEM(
      cdpManagerAddress,
      gemJoinAddress,
      endAddress,
      cdpId,
      { dsProxy: true }
    );
  }

}
