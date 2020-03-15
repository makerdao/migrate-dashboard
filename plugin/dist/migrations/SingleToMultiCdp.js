"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));

var _tracksTransactions = require("@makerdao/dai/dist/src/utils/tracksTransactions");

var _utils = require("../utils");

var _ = require("..");

var _dec, _class;

var SingleToMultiCdp = (_dec = (0, _tracksTransactions.tracksTransactionsWithOptions)({
  numArguments: 5
}), (_class =
/*#__PURE__*/
function () {
  function SingleToMultiCdp(manager) {
    (0, _classCallCheck2["default"])(this, SingleToMultiCdp);
    this._manager = manager;
    return this;
  }

  (0, _createClass2["default"])(SingleToMultiCdp, [{
    key: "check",
    value: function () {
      var _check = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee() {
        var _ref;

        var address, proxyAddress, idsFromProxy, idsFromAddress;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                address = this._manager.get('accounts').currentAddress();
                _context.next = 3;
                return this._manager.get('proxy').currentProxy();

              case 3:
                proxyAddress = _context.sent;

                if (!proxyAddress) {
                  _context.next = 10;
                  break;
                }

                _context.next = 7;
                return this._manager.get('cdp').getCdpIds(proxyAddress);

              case 7:
                _context.t0 = _context.sent;
                _context.next = 11;
                break;

              case 10:
                _context.t0 = [];

              case 11:
                idsFromProxy = _context.t0;
                _context.next = 14;
                return this._manager.get('cdp').getCdpIds(address);

              case 14:
                idsFromAddress = _context.sent;
                return _context.abrupt("return", idsFromProxy.length + idsFromAddress.length > 0 ? (_ref = {}, (0, _defineProperty2["default"])(_ref, proxyAddress, idsFromProxy), (0, _defineProperty2["default"])(_ref, address, idsFromAddress), _ref) : {});

              case 16:
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
      _regenerator["default"].mark(function _callee2(cupId) {
        var _this = this;

        var payment,
            maxPayAmount,
            minRatio,
            _ref2,
            promise,
            jug,
            migrationProxy,
            migration,
            defaultArgs,
            _this$_setMethodAndAr,
            method,
            args,
            _args2 = arguments;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                payment = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : 'MKR';
                maxPayAmount = _args2.length > 2 ? _args2[2] : undefined;
                minRatio = _args2.length > 3 ? _args2[3] : undefined;
                _ref2 = _args2.length > 4 ? _args2[4] : undefined, promise = _ref2.promise;
                jug = this._manager.get('smartContract').getContract('MCD_JUG').address;
                migrationProxy = this._manager.get('smartContract').getContract('MIGRATION_PROXY_ACTIONS');
                migration = this._manager.get('smartContract').getContract('MIGRATION');
                defaultArgs = [migration.address, jug, (0, _utils.getIdBytes)(cupId)];
                _this$_setMethodAndAr = this._setMethodAndArgs(payment, defaultArgs, maxPayAmount, minRatio), method = _this$_setMethodAndAr.method, args = _this$_setMethodAndAr.args;

                if (!(payment !== 'DEBT')) {
                  _context2.next = 12;
                  break;
                }

                _context2.next = 12;
                return this._requireAllowance(cupId, payment);

              case 12:
                return _context2.abrupt("return", migrationProxy[method].apply(migrationProxy, (0, _toConsumableArray2["default"])(args).concat([{
                  dsProxy: true,
                  promise: promise
                }])).then(function (txo) {
                  return _this._manager.get('mcd:cdpManager').getNewCdpId(txo);
                }));

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function execute(_x) {
        return _execute.apply(this, arguments);
      }

      return execute;
    }()
  }, {
    key: "_requireAllowance",
    value: function () {
      var _requireAllowance2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(cupId, payment) {
        var address, proxyAddress, cdp, token, fee, mkrPrice, allowance;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                address = this._manager.get('web3').currentAddress();
                _context3.next = 3;
                return this._manager.get('proxy').currentProxy();

              case 3:
                proxyAddress = _context3.sent;
                _context3.next = 6;
                return this._manager.get('cdp').getCdp(cupId);

              case 6:
                cdp = _context3.sent;
                token = payment === 'MKR' ? this._getToken(_.MKR) : this._getToken(_.SAI);
                _context3.next = 10;
                return cdp.getGovernanceFee();

              case 10:
                fee = _context3.sent;

                if (!(payment === 'GEM')) {
                  _context3.next = 16;
                  break;
                }

                _context3.next = 14;
                return this._manager.get('price').getMkrPrice();

              case 14:
                mkrPrice = _context3.sent;
                fee = (0, _.SAI)(fee.toNumber() * mkrPrice.toNumber());

              case 16:
                _context3.next = 18;
                return token.allowance(address, proxyAddress);

              case 18:
                allowance = _context3.sent;

                if (!allowance.lt(fee.toNumber())) {
                  _context3.next = 22;
                  break;
                }

                _context3.next = 22;
                return token.approve(proxyAddress, fee.times(1.5));

              case 22:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function _requireAllowance(_x2, _x3) {
        return _requireAllowance2.apply(this, arguments);
      }

      return _requireAllowance;
    }()
  }, {
    key: "_setMethodAndArgs",
    value: function _setMethodAndArgs(payment, defaultArgs, maxPayAmount, minRatio) {
      var otc = this._manager.get('smartContract').getContract('MAKER_OTC').address;

      if (payment === 'GEM') {
        var gem = this._manager.get('token').getToken('DAI').address();

        return {
          method: 'migratePayFeeWithGem',
          args: [].concat((0, _toConsumableArray2["default"])(defaultArgs), [otc, gem, (0, _.SAI)(maxPayAmount).toFixed('wei')])
        };
      }

      if (payment === 'DEBT') {
        return {
          method: 'migratePayFeeWithDebt',
          args: [].concat((0, _toConsumableArray2["default"])(defaultArgs), [otc, (0, _.SAI)(maxPayAmount).toFixed('wei'), (0, _.SAI)(minRatio).toFixed('wei')])
        };
      }

      return {
        method: 'migrate',
        args: defaultArgs
      };
    } // the Sai available is the smaller of two values:
    //  - the Sai locked in the migration contract's special CDP
    //  - the debt ceiling for the ETH-A ilk in MCD

  }, {
    key: "migrationSaiAvailable",
    value: function () {
      var _migrationSaiAvailable = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4() {
        var vat, migrationContractAddress, ethA, _ref3, _ref4, migrationCdp, debtHeadroom, lockedSai;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                vat = this._manager.get('smartContract').getContract('MCD_VAT_1');
                migrationContractAddress = this._manager.get('smartContract').getContract('MIGRATION').address;
                ethA = this._manager.get('mcd:cdpType').getCdpType(null, 'ETH-A');
                ethA.reset();
                _context4.next = 6;
                return Promise.all([vat.urns((0, _utils.stringToBytes)('SAI'), migrationContractAddress), ethA.prefetch().then(function () {
                  if (ethA.debtCeiling.toNumber() === 0) return (0, _.SAI)(0);
                  return (0, _.SAI)(ethA.debtCeiling.minus(ethA.totalDebt));
                })]);

              case 6:
                _ref3 = _context4.sent;
                _ref4 = (0, _slicedToArray2["default"])(_ref3, 2);
                migrationCdp = _ref4[0];
                debtHeadroom = _ref4[1];
                // for technical reasons, the liquidation ratio of the mcd migration cdp
                // cannot be 0. but it will be close enough that the migration contract will
                // not be able to free only the last 1 wei of sai
                lockedSai = _.SAI.wei(migrationCdp.ink);
                if (lockedSai.gt(0)) lockedSai = lockedSai.minus(_.SAI.wei(1));
                return _context4.abrupt("return", debtHeadroom.lt(lockedSai) ? debtHeadroom : lockedSai);

              case 13:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function migrationSaiAvailable() {
        return _migrationSaiAvailable.apply(this, arguments);
      }

      return migrationSaiAvailable;
    }()
  }, {
    key: "saiAmountNeededToBuyMkr",
    value: function () {
      var _saiAmountNeededToBuyMkr = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5(mkrAmount) {
        var otcContract;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                otcContract = this._manager.get('smartContract').getContract('MAKER_OTC');
                return _context5.abrupt("return", otcContract.getPayAmount(this._getToken(_.SAI).address(), this._getToken(_.MKR).address(), (0, _.MKR)(mkrAmount).toFixed('wei')).then(function (a) {
                  return _.SAI.wei(a);
                }));

              case 2:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function saiAmountNeededToBuyMkr(_x4) {
        return _saiAmountNeededToBuyMkr.apply(this, arguments);
      }

      return saiAmountNeededToBuyMkr;
    }()
  }, {
    key: "_getToken",
    value: function _getToken(symbol) {
      return this._manager.get('token').getToken(symbol);
    }
  }]);
  return SingleToMultiCdp;
}(), ((0, _applyDecoratedDescriptor2["default"])(_class.prototype, "execute", [_dec], Object.getOwnPropertyDescriptor(_class.prototype, "execute"), _class.prototype)), _class));
exports["default"] = SingleToMultiCdp;