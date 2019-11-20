import { createRouter } from 'next/router';

process.env.TESTING = true;

// this sets up the singleton so we can test components that use the router.
// this will probably have to become a test helper for more sophisticated test
// scenarios.
const router = createRouter('/', {}, null, {});

router.replace = jest.fn();
router.push = jest.fn();
