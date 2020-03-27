export default class RedeemSai {
  constructor(manager) {
    this._manager = manager;
    this._tap = this._manager.get('smartContract').getContract('SAI_TAP');
    return this;
  }

  off() {
    return this._tap.off();
  }

  fog() {
    return this._tap.fog();
  }

  getRate() {
    return this._tap.fix();
  }

  redeemSai(wad) {
    return this._tap.cash(wad);
  }
}