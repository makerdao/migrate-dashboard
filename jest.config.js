module.exports = {
  coverageReporters: ['json', 'lcov', 'text-summary'],
  collectCoverageFrom: [
    '{components,hooks,layouts,pages,plugin,providers,utils}/**/*.js'
  ],
  setupFilesAfterEnv: ['./tests/helpers/setup'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.(svg|png)$': './tests/helpers/transformImportToPath'
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.yalc/'],
  modulePathIgnorePatterns: [
    '<rootDir>/.yalc/@makerdao/dai-plugin-(mcd|migrations|scd)/test'
  ],
  testEnvironment: 'jsdom'
};
