"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.MDAI_1 = exports.MKR = exports.DAI = exports.SAI = exports.OLD_MKR = exports.ServiceRoles = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _currency = require("@makerdao/currency");

var _testnet = _interopRequireDefault(require("../contracts/addresses/testnet.json"));

var _kovan = _interopRequireDefault(require("../contracts/addresses/kovan.json"));

var _mainnet = _interopRequireDefault(require("../contracts/addresses/mainnet.json"));

var _abiMap = _interopRequireDefault(require("../contracts/abiMap.json"));

var _MigrationService = _interopRequireDefault(require("./MigrationService"));

var _constants = require("./constants");

var ServiceRoles = _constants.ServiceRoles;
exports.ServiceRoles = ServiceRoles;
var MIGRATION = ServiceRoles.MIGRATION; // this implementation assumes that all contracts in kovan.json, mainnet.json are also in testnet.json

var allContracts = Object.entries(_testnet["default"]).reduce(function (contracts, _ref) {
  var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
      name = _ref2[0],
      testnetAddress = _ref2[1];

  var abiName = _abiMap["default"][name];

  if (abiName) {
    contracts[name] = {
      abi: require("../contracts/abis/".concat(abiName, ".json")),
      address: {
        testnet: testnetAddress,
        kovan: _kovan["default"][name],
        mainnet: _mainnet["default"][name]
      }
    };
  }

  return contracts;
}, {});
var OLD_MKR = (0, _currency.createCurrency)('OLD_MKR');
exports.OLD_MKR = OLD_MKR;
var SAI = (0, _currency.createCurrency)('DAI');
exports.SAI = SAI;
var DAI = (0, _currency.createCurrency)('MDAI');
exports.DAI = DAI;
var MKR = (0, _currency.createCurrency)('MKR');
exports.MKR = MKR;

function overrideContractAddresses(addressOverrides, contracts) {
  Object.entries(addressOverrides).forEach(function (_ref3) {
    var _ref4 = (0, _slicedToArray2["default"])(_ref3, 2),
        name = _ref4[0],
        overrideAddress = _ref4[1];

    if (contracts[name]) {
      contracts[name] = (0, _objectSpread2["default"])({}, contracts[name], {
        address: overrideAddress
      });
    }
  });
  return contracts;
}

var MDAI_1 = (0, _currency.createCurrency)('MDAI_1');
exports.MDAI_1 = MDAI_1;
var _default = {
  addConfig: function addConfig(_) {
    var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        addressOverrides = _ref5.addressOverrides;

    console.log('MIGRATION SERVICE WORK3');
    var addContracts = addressOverrides ? overrideContractAddresses(addressOverrides, allContracts) : allContracts;
    return (0, _defineProperty2["default"])({
      smartContract: {
        addContracts: addContracts
      },
      token: {
        erc20: [{
          currency: OLD_MKR,
          decimals: 18,
          address: addContracts.OLD_MKR.address
        }, {
          currency: MDAI_1,
          address: addContracts.MCD_DAI_1.address
        }]
      },
      additionalServices: [MIGRATION]
    }, MIGRATION, _MigrationService["default"]);
  }
};
exports["default"] = _default;