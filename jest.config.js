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
  // roots: ['<rootDir>/components', '<rootDir>/hooks', '<rootDir>/languages', '<rootDir>/layouts', '<rootDir>/pages', '<rootDir>/plugin', '<rootDir>/providers', '<rootDir>/references', '<rootDir>/tests', '<rootDir>/utils'],
  modulePathIgnorePatterns: ['<rootDir>/.yalc/@makerdao/dai-plugin-scd/test']
};
