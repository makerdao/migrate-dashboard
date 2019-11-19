module.exports = {
  coverageReporters: ['json', 'lcov', 'text-summary'],
  collectCoverageFrom: [
    '{components,hooks,layouts,pages,providers,utils}/**/*.js'
  ],
  setupFilesAfterEnv: ['./tests/helpers/setup'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.svg$': './tests/helpers/transformSvgToPath'
  }
};
