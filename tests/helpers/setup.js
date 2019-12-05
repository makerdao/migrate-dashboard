import { createRouter } from 'next/router';

process.env.TESTING = true;
process.env.TEST_RPC_URL = 'http://localhost:2000';

// this sets up the singleton so we can test components that use the router.
// this will probably have to become a test helper for more sophisticated test
// scenarios.
const router = createRouter('/', {}, null, {});

router.replace = jest.fn();
router.push = jest.fn();

// https://github.com/testing-library/react-testing-library/issues/281
const originalError = console.error;
beforeAll(() => {
  jest.setTimeout(10000);
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
