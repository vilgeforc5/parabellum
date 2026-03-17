//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
const path = require('node:path');
const createNextIntlPlugin = require('next-intl/plugin');

const requestConfigPath = path.relative(
  process.cwd(),
  path.join(__dirname, 'src/i18n/request.ts'),
);

const withNextIntl = createNextIntlPlugin(
  requestConfigPath.startsWith('.')
    ? requestConfigPath
    : `./${requestConfigPath}`,
);

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withNextIntl,
];

module.exports = composePlugins(...plugins)(nextConfig);
