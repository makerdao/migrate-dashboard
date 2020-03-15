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

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _servicesCore = require("@makerdao/services-core");

var _constants = require("./constants");

var _SingleToMultiCdp = _interopRequireDefault(require("./migrations/SingleToMultiCdp"));

var _GlobalSettlementSavingsDai = _interopRequireDefault(require("./migrations/GlobalSettlementSavingsDai"));

var _GlobalSettlementCollateralClaims = _interopRequireDefault(require("./migrations/GlobalSettlementCollateralClaims"));

var _GlobalSettlementDaiRedeemer = _interopRequireDefault(require("./migrations/GlobalSettlementDaiRedeemer"));

var _SaiToDai = _interopRequireDefault(require("./migrations/SaiToDai"));

var _MkrRedeemer = _interopRequireDefault(require("./migrations/MkrRedeemer"));

var _DaiToSai = _interopRequireDefault(require("./migrations/DaiToSai"));

var _ChiefMigrate = _interopRequireDefault(require("./migrations/ChiefMigrate"));

var _migrations;

var SINGLE_TO_MULTI_CDP = _constants.Migrations.SINGLE_TO_MULTI_CDP,
    SAI_TO_DAI = _constants.Migrations.SAI_TO_DAI,
    DAI_TO_SAI = _constants.Migrations.DAI_TO_SAI,
    MKR_REDEEMER = _constants.Migrations.MKR_REDEEMER,
    CHIEF_MIGRATE = _constants.Migrations.CHIEF_MIGRATE;
var migrations = (_migrations = {}, (0, _defineProperty2["default"])(_migrations, SINGLE_TO_MULTI_CDP, _SingleToMultiCdp["default"]), (0, _defineProperty2["default"])(_migrations, SAI_TO_DAI, _SaiToDai["default"]), (0, _defineProperty2["default"])(_migrations, DAI_TO_SAI, _DaiToSai["default"]), (0, _defineProperty2["default"])(_migrations, CHIEF_MIGRATE, _ChiefMigrate["default"]), (0, _defineProperty2["default"])(_migrations, _constants.Migrations.GLOBAL_SETTLEMENT_SAVINGS_DAI, _GlobalSettlementSavingsDai["default"]), (0, _defineProperty2["default"])(_migrations, _constants.Migrations.GLOBAL_SETTLEMENT_COLLATERAL_CLAIMS, _GlobalSettlementCollateralClaims["default"]), (0, _defineProperty2["default"])(_migrations, _constants.Migrations.GLOBAL_SETTLEMENT_DAI_REDEEMER, _GlobalSettlementDaiRedeemer["default"]), (0, _defineProperty2["default"])(_migrations, _constants.Migrations.MKR_REDEEMER, _MkrRedeemer["default"]), _migrations);

var MigrationService =
/*#__PURE__*/
function (_PublicService) {
  (0, _inherits2["default"])(MigrationService, _PublicService);

  function MigrationService() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _constants.ServiceRoles.MIGRATION;
    (0, _classCallCheck2["default"])(this, MigrationService);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(MigrationService).call(this, name, ['smartContract', 'accounts', 'cdp', 'proxy', 'token', 'web3', 'mcd:cdpManager', 'mcd:cdpType', 'price']));
  }

  (0, _createClass2["default"])(MigrationService, [{
    key: "getAllMigrationsIds",
    value: function getAllMigrationsIds() {
      return Object.values(_constants.Migrations);
    }
  }, {
    key: "getMigration",
    value: function getMigration(id) {
      return this._getCachedMigration(id);
    }
  }, {
    key: "runAllChecks",
    value: function () {
      var _runAllChecks = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee() {
        var _ref;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _ref = {};
                _context.t0 = _defineProperty2["default"];
                _context.t1 = _ref;
                _context.t2 = SINGLE_TO_MULTI_CDP;
                _context.next = 6;
                return this.getMigration(SINGLE_TO_MULTI_CDP).check();

              case 6:
                _context.t3 = _context.sent;
                (0, _context.t0)(_context.t1, _context.t2, _context.t3);
                _context.t4 = _defineProperty2["default"];
                _context.t5 = _ref;
                _context.t6 = SAI_TO_DAI;
                _context.next = 13;
                return this.getMigration(SAI_TO_DAI).check();

              case 13:
                _context.t7 = _context.sent;
                (0, _context.t4)(_context.t5, _context.t6, _context.t7);
                _context.t8 = _defineProperty2["default"];
                _context.t9 = _ref;
                _context.t10 = DAI_TO_SAI;
                _context.next = 20;
                return this.getMigration(DAI_TO_SAI).check();

              case 20:
                _context.t11 = _context.sent;
                (0, _context.t8)(_context.t9, _context.t10, _context.t11);
                _context.t12 = _defineProperty2["default"];
                _context.t13 = _ref;
                _context.t14 = CHIEF_MIGRATE;
                _context.next = 27;
                return this.getMigration(CHIEF_MIGRATE).check();

              case 27:
                _context.t15 = _context.sent;
                (0, _context.t12)(_context.t13, _context.t14, _context.t15);
                _context.t16 = _defineProperty2["default"];
                _context.t17 = _ref;
                _context.t18 = MKR_REDEEMER;
                _context.next = 34;
                return this.getMigration(MKR_REDEEMER).check();

              case 34:
                _context.t19 = _context.sent;
                (0, _context.t16)(_context.t17, _context.t18, _context.t19);
                _context.t20 = _defineProperty2["default"];
                _context.t21 = _ref;
                _context.t22 = _constants.Migrations.GLOBAL_SETTLEMENT_COLLATERAL_CLAIMS;
                _context.next = 41;
                return this.getMigration(_constants.Migrations.GLOBAL_SETTLEMENT_COLLATERAL_CLAIMS).check();

              case 41:
                _context.t23 = _context.sent;
                (0, _context.t20)(_context.t21, _context.t22, _context.t23);
                return _context.abrupt("return", _ref);

              case 44:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function runAllChecks() {
        return _runAllChecks.apply(this, arguments);
      }

      return runAllChecks;
    }()
  }, {
    key: "_getCachedMigration",
    value: function _getCachedMigration(id) {
      if (!this._cache) this._cache = {};

      if (!this._cache[id]) {
        var migration = migrations[id];
        if (!migration) return;
        this._cache[id] = new migration(this);
      }

      return this._cache[id];
    }
  }]);
  return MigrationService;
}(_servicesCore.PublicService);

exports["default"] = MigrationService;