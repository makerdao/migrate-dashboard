"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _index = require("../index");

var GlobalSettlementDaiRedeemer =
/*#__PURE__*/
function () {
  function GlobalSettlementDaiRedeemer(container) {
    (0, _classCallCheck2["default"])(this, GlobalSettlementDaiRedeemer);
    this._container = container;
    return this;
  }

  (0, _createClass2["default"])(GlobalSettlementDaiRedeemer, [{
    key: "check",
    value: function () {
      var _check = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee() {
        var smartContract, end, isInGlobalSettlement, address, daiBalance, cdpManagerAddress, _ref, _ref2, ilks, uniqueIlks, fixes;

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
                _context.next = 15;
                return this._container.get('token').getToken(_index.MDAI_1).balance();

              case 15:
                daiBalance = _context.sent;

                if (!daiBalance.lte(0)) {
                  _context.next = 18;
                  break;
                }

                return _context.abrupt("return", false);

              case 18:
                cdpManagerAddress = smartContract.getContractAddress('CDP_MANAGER_1');
                _context.next = 21;
                return smartContract.getContract('GET_CDPS_1').getCdpsDesc(cdpManagerAddress, address);

              case 21:
                _ref = _context.sent;
                _ref2 = (0, _slicedToArray2["default"])(_ref, 3);
                ilks = _ref2[2];
                uniqueIlks = (0, _toConsumableArray2["default"])(new Set(ilks));
                _context.next = 27;
                return Promise.all(uniqueIlks.map(function (ilk) {
                  return end.fix(ilk);
                }));

              case 27:
                fixes = _context.sent;
                return _context.abrupt("return", fixes.some(function (fix) {
                  return fix.gt(0);
                }));

              case 29:
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
  return GlobalSettlementDaiRedeemer;
}();

exports["default"] = GlobalSettlementDaiRedeemer;