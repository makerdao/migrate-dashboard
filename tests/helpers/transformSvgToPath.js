const debug = require('debug');
const log = debug('transform:svg');
const path = require('path');

module.exports = {
  process: (src, filePath) => {
    log(filePath);
    if (path.extname(filePath) !== '.svg') return src;
    return `module.exports = "${filePath}"`;
  }
};
