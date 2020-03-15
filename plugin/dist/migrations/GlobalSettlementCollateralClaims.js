"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _constants = require("../constants");

var GlobalSettlementCollateralClaims =
/*#__PURE__*/
function () {
  function GlobalSettlementCollateralClaims(container) {
    (0, _classCallCheck2["default"])(this, GlobalSettlementCollateralClaims);
    console.log('global settlement works');
    this._container = container;
    return this;
  }

  (0, _createClass2["default"])(GlobalSettlementCollateralClaims, [{
    key: "check",
    value: function () {
      var _check = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2() {
        var end, isInGlobalSettlement, address, cdpManager, vat, _ref, _ref2, ids, ilks, freeCollateral;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                console.log('global settlement CHECK works');
                end = this._container.get('smartContract').getContract('MCD_END_1');
                _context2.next = 4;
                return end.live();

              case 4:
                isInGlobalSettlement = !_context2.sent;

                if (isInGlobalSettlement) {
                  _context2.next = 7;
                  break;
                }

                return _context2.abrupt("return", false);

              case 7:
                _context2.next = 9;
                return this._container.get('proxy').currentProxy();

              case 9:
                _context2.t0 = _context2.sent;

                if (_context2.t0) {
                  _context2.next = 12;
                  break;
                }

                _context2.t0 = this._container.get('accounts').currentAddress();

              case 12:
                address = _context2.t0;
                cdpManager = this._container.get('smartContract').getContract('CDP_MANAGER_1');
                vat = this._container.get('smartContract').getContract('MCD_VAT_1');
                _context2.next = 17;
                return this._container.get('smartContract').getContract('GET_CDPS_1').getCdpsDesc(cdpManager.address, address);

              case 17:
                _ref = _context2.sent;
                _ref2 = (0, _slicedToArray2["default"])(_ref, 3);
                ids = _ref2[0];
                ilks = _ref2[2];
                _context2.next = 23;
                return Promise.all(ids.map(
                /*#__PURE__*/
                function () {
                  var _ref3 = (0, _asyncToGenerator2["default"])(
                  /*#__PURE__*/
                  _regenerator["default"].mark(function _callee(id, i) {
                    var urn, vatUrn, tag, ilk, owed;
                    return _regenerator["default"].wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.next = 2;
                            return cdpManager.urns(id);

                          case 2:
                            urn = _context.sent;
                            _context.next = 5;
                            return vat.urns(ilks[i], urn);

                          case 5:
                            vatUrn = _context.sent;
                            _context.next = 8;
                            return end.tags(ilks[i]);

                          case 8:
                            tag = _context.sent;
                            _context.next = 11;
                            return vat.ilks(ilks[i]);

                          case 11:
                            ilk = _context.sent;
                            owed = new _bignumber["default"](vatUrn.art).times(ilk.rate).div(_constants.RAY).times(tag).div(_constants.RAY);
                            return _context.abrupt("return", tag.gt(0) && new _bignumber["default"](vatUrn.ink).minus(owed).gt(0));

                          case 14:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x, _x2) {
                    return _ref3.apply(this, arguments);
                  };
                }()));

              case 23:
                freeCollateral = _context2.sent;
                return _context2.abrupt("return", freeCollateral.some(function (exists) {
                  return exists;
                }));

              case 25:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function check() {
        return _check.apply(this, arguments);
      }

      return check;
    }()
  }, {
    key: "freeEth",
    value: function freeEth(cdpId) {
      var cdpManagerAddress = this._container.get('smartContract').getContractAddress('CDP_MANAGER_1');

      var endAddress = this._container.get('smartContract').getContractAddress('MCD_END_1');

      var ethJoinAddress = this._container.get('smartContract').getContractAddress('MCD_JOIN_ETH_A');

      console.log('PROXY_ACTIONS_END', this._container.get('smartContract').getContract('PROXY_ACTIONS_END'));
      return this._container.get('smartContract').getContract('PROXY_ACTIONS_END').freeETH(cdpManagerAddress, ethJoinAddress, endAddress, cdpId);
    }
  }]);
  return GlobalSettlementCollateralClaims;
}();

exports["default"] = GlobalSettlementCollateralClaims;