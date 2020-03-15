"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var MkrRedeemer =
/*#__PURE__*/
function () {
  function MkrRedeemer(manager) {
    (0, _classCallCheck2["default"])(this, MkrRedeemer);
    this._manager = manager;
    return this;
  }

  (0, _createClass2["default"])(MkrRedeemer, [{
    key: "check",
    value: function check() {
      var address = this._manager.get('web3').currentAddress();

      var oldMkr = this._manager.get('token').getToken('OLD_MKR');

      return oldMkr.balanceOf(address);
    }
  }]);
  return MkrRedeemer;
}();

exports["default"] = MkrRedeemer;