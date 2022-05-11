const TestSequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends TestSequencer {
  sort(tests) {
    console.log('tests', tests);
    return tests.sort((testA, testB) => testA.path.localeCompare(testB.path));
  }
}

module.exports = CustomSequencer;