export default class SCDShutdown {
  constructor(manager) {
    this._manager = manager;
    this._tap = this._manager.get('smartContract').getContract('SAI_TAP');
    return this;
  }
}