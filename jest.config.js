module.exports = {
  coverageReporters: ['json', 'lcov', 'text-summary'],
  collectCoverageFrom: [
    '{components,hooks,layouts,pages,providers,utils}/**/*.js'
  ],
  setupFilesAfterEnv: ['./utils/testing/setup'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.svg$': './utils/testing/transformSvgToPath'
  }
};
