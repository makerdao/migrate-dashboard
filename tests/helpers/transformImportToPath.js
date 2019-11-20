const debug = require('debug');
const log = debug('transform:svg');

module.exports = {
  process: (src, filePath) => {
    log(filePath);
    return `module.exports = "${filePath}"`;
  }
};
