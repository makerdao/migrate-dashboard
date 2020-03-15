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

var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));

var _tracksTransactions = _interopRequireDefault(require("@makerdao/dai/dist/src/utils/tracksTransactions"));

var _ = require("..");

var _class;

var SaiToDai = (_class =
/*#__PURE__*/
function () {
  function SaiToDai(manager) {
    (0, _classCallCheck2["default"])(this, SaiToDai);
    this._manager = manager;
    this._sai = manager.get('token').getToken(_.SAI);
    return this;
  }

  (0, _createClass2["default"])(SaiToDai, [{
    key: "check",
    value: function () {
      var _check = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", this._sai.balance());

              case 1:
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
  }, {
    key: "execute",
    value: function () {
      var _execute = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(amount, _ref) {
        var promise, formattedAmount, address, migrationContract, allowance;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                promise = _ref.promise;
                formattedAmount = (0, _.SAI)(amount).toFixed('wei');
                address = this._manager.get('web3').currentAddress();
                migrationContract = this._manager.get('smartContract').getContract('MIGRATION');
                _context2.next = 6;
                return this._sai.allowance(address, migrationContract.address);

              case 6:
                allowance = _context2.sent;

                if (!(allowance.toNumber() < amount)) {
                  _context2.next = 10;
                  break;
                }

                _context2.next = 10;
                return this._sai.approve(migrationContract.address, formattedAmount, {
                  promise: promise
                });

              case 10:
                return _context2.abrupt("return", migrationContract.swapSaiToDai(formattedAmount, {
                  promise: promise
                }));

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function execute(_x, _x2) {
        return _execute.apply(this, arguments);
      }

      return execute;
    }()
  }]);
  return SaiToDai;
}(), ((0, _applyDecoratedDescriptor2["default"])(_class.prototype, "execute", [_tracksTransactions["default"]], Object.getOwnPropertyDescriptor(_class.prototype, "execute"), _class.prototype)), _class);
exports["default"] = SaiToDai;