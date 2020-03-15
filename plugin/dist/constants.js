"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RAD = exports.RAY = exports.WAD = exports.Migrations = exports.ServiceRoles = void 0;

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var ServiceRoles = {
  MIGRATION: 'migration'
};
exports.ServiceRoles = ServiceRoles;
var Migrations = {
  SINGLE_TO_MULTI_CDP: 'single-to-multi-cdp',
  SAI_TO_DAI: 'sai-to-dai',
  DAI_TO_SAI: 'dai-to-sai',
  GLOBAL_SETTLEMENT_SAVINGS_DAI: 'global-settlement-savings-dai',
  GLOBAL_SETTLEMENT_COLLATERAL_CLAIMS: 'global-settlement-collateral-claims',
  GLOBAL_SETTLEMENT_DAI_REDEEMER: 'global-settlement-dai-redeemer',
  MKR_REDEEMER: 'mkr-redeemer',
  CHIEF_MIGRATE: 'chief-migrate'
};
exports.Migrations = Migrations;
var WAD = new _bignumber["default"]('1e18');
exports.WAD = WAD;
var RAY = new _bignumber["default"]('1e27');
exports.RAY = RAY;
var RAD = new _bignumber["default"]('1e45');
exports.RAD = RAD;