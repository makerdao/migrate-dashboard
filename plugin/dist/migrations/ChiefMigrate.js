"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _ = require("..");

var ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

var ChiefMigrate =
/*#__PURE__*/
function () {
  function ChiefMigrate(manager) {
    (0, _classCallCheck2["default"])(this, ChiefMigrate);
    this._manager = manager;
    this._oldChief = manager.get('smartContract').getContract('OLD_CHIEF');
    this._oldProxyFactoryContract = manager.get('smartContract').getContractByName('OLD_VOTE_PROXY_FACTORY');
    return this;
  }

  (0, _createClass2["default"])(ChiefMigrate, [{
    key: "check",
    value: function () {
      var _check = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee() {
        var address, voteProxyAddress, mkrLockedDirectly, mkrLockedViaProxy;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                address = this._manager.get('accounts').currentAddress();
                _context.next = 3;
                return this._getVoteProxyAddress(address);

              case 3:
                voteProxyAddress = _context.sent;
                _context.t0 = _.MKR;
                _context.next = 7;
                return this._oldChief.deposits(address);

              case 7:
                _context.t1 = _context.sent;
                mkrLockedDirectly = _context.t0.wei.call(_context.t0, _context.t1);
                _context.t2 = _.MKR;

                if (!voteProxyAddress) {
                  _context.next = 16;
                  break;
                }

                _context.next = 13;
                return this._oldChief.deposits(voteProxyAddress);

              case 13:
                _context.t3 = _context.sent;
                _context.next = 17;
                break;

              case 16:
                _context.t3 = 0;

              case 17:
                _context.t4 = _context.t3;
                mkrLockedViaProxy = _context.t2.wei.call(_context.t2, _context.t4);
                return _context.abrupt("return", {
                  mkrLockedDirectly: mkrLockedDirectly,
                  mkrLockedViaProxy: mkrLockedViaProxy
                });

              case 20:
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
    key: "_getVoteProxyAddress",
    value: function () {
      var _getVoteProxyAddress2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(walletAddress) {
        var _ref, _ref2, proxyAddressCold, proxyAddressHot;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return Promise.all([this._oldProxyFactoryContract.coldMap(walletAddress), this._oldProxyFactoryContract.hotMap(walletAddress)]);

              case 2:
                _ref = _context2.sent;
                _ref2 = (0, _slicedToArray2["default"])(_ref, 2);
                proxyAddressCold = _ref2[0];
                proxyAddressHot = _ref2[1];

                if (!(proxyAddressCold !== ZERO_ADDRESS)) {
                  _context2.next = 8;
                  break;
                }

                return _context2.abrupt("return", proxyAddressCold);

              case 8:
                if (!(proxyAddressHot !== ZERO_ADDRESS)) {
                  _context2.next = 10;
                  break;
                }

                return _context2.abrupt("return", proxyAddressHot);

              case 10:
                return _context2.abrupt("return", null);

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function _getVoteProxyAddress(_x) {
        return _getVoteProxyAddress2.apply(this, arguments);
      }

      return _getVoteProxyAddress;
    }()
  }]);
  return ChiefMigrate;
}();

exports["default"] = ChiefMigrate;