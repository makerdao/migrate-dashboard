import getConfig from '../../next.config';
const mockConfig = getConfig(null, {});

export default function() {
  return mockConfig;
}
