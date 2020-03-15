"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringToBytes = stringToBytes;
exports.getIdBytes = getIdBytes;

var _assert = _interopRequireDefault(require("assert"));

var _padStart = _interopRequireDefault(require("lodash/padStart"));

function stringToBytes(str) {
  (0, _assert["default"])(!!str, 'argument is falsy');
  (0, _assert["default"])(typeof str === 'string', 'argument is not a string');
  return '0x' + Buffer.from(str).toString('hex');
}

function getIdBytes(id) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  (0, _assert["default"])(typeof id === 'number', 'ID must be a number');
  return (prefix ? '0x' : '') + (0, _padStart["default"])(id.toString(16), 64, '0');
}