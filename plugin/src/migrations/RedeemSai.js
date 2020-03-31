import { DAI } from "..";

export default class RedeemSai {
  constructor(manager) {
    this._manager = manager;
    this._tap = this._manager.get('smartContract').getContract('SAI_TAP');
    return this;
  }

  off() {
    return this._tap.off();
  }

  async fog() {
    const fog = await this._tap.fog();
    return fog / Math.pow(10, 18);
  }

  async getRate() {
    const fix = await this._tap.fix();
    return fix / Math.pow(10, 27);
  }

  redeemSai(wad) {
    return this._tap.cash(DAI(wad).toFixed(18));
  }
}