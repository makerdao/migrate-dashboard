// this probably won't work if we ever need server-side rendering
const { execSync } = require('child_process');
const lastCommit = execSync('git log --oneline | head -n1')
  .toString()
  .replace(/\n/g, '');

const config = {
  publicRuntimeConfig: {
    lastCommit
  }
};

const { PHASE_PRODUCTION_SERVER } =
  process.env.NODE_ENV === 'development'
    ? {}
    : !process.env.NOW_REGION
    ? require('next/constants')
    : require('next-server/constants');

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_PRODUCTION_SERVER) {
    return config;
  }

  const withCSS = require('@zeit/next-css');
  const withImages = require('next-images');

  return withImages(withCSS(config));
};
