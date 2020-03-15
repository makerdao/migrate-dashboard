"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var GlobalSettlementSavingsDai =
/*#__PURE__*/
function () {
  function GlobalSettlementSavingsDai(container) {
    (0, _classCallCheck2["default"])(this, GlobalSettlementSavingsDai);
    this._container = container;
    return this;
  }

  (0, _createClass2["default"])(GlobalSettlementSavingsDai, [{
    key: "check",
    value: function () {
      var _check = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee() {
        var smartContract, end, isInGlobalSettlement, address, pot, balance;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                smartContract = this._container.get('smartContract');
                end = smartContract.getContract('MCD_END_1');
                _context.next = 4;
                return end.live();

              case 4:
                isInGlobalSettlement = !_context.sent;

                if (isInGlobalSettlement) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt("return", false);

              case 7:
                _context.next = 9;
                return this._container.get('proxy').currentProxy();

              case 9:
                _context.t0 = _context.sent;

                if (_context.t0) {
                  _context.next = 12;
                  break;
                }

                _context.t0 = this._container.get('accounts').currentAddress();

              case 12:
                address = _context.t0;
                pot = smartContract.getContract('MCD_POT_1');
                _context.next = 16;
                return pot.pie(address);

              case 16:
                balance = _context.sent;
                return _context.abrupt("return", balance.gt(0));

              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function check() {
        return _check.apply(this, arguments);
      }

      return check;
    }()
  }]);
  return GlobalSettlementSavingsDai;
}();

exports["default"] = GlobalSettlementSavingsDai;