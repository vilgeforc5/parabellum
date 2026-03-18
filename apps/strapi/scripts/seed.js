'use strict';

const path = require('node:path');
const { compileStrapi, createStrapi } = require('@strapi/strapi');

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function hasTruthyEnv(name) {
  return /^(1|true|yes)$/i.test(process.env[name] ?? '');
}

async function destroySafely(strapi) {
  if (!strapi) {
    return;
  }

  try {
    await strapi.destroy();
  } catch (error) {
    console.error('Failed to destroy Strapi cleanly.', error);
  }
}

async function main() {
  if (hasFlag('--help')) {
    console.log('Usage: pnpm nx run strapi:seed -- [--force] [--allow-production]');
    process.exit(0);
  }

  const appDir = path.resolve(__dirname, '..');
  const force = hasFlag('--force') || hasTruthyEnv('SEED_FORCE');
  const allowProduction =
    hasFlag('--allow-production') || hasTruthyEnv('SEED_ALLOW_PRODUCTION');

  process.env.STRAPI_SKIP_BOOTSTRAP_SEED = 'true';

  const { distDir } = await compileStrapi({ appDir });
  const resolvedDistDir = path.isAbsolute(distDir)
    ? distDir
    : path.join(appDir, distDir);
  const strapi = createStrapi({
    appDir,
    distDir: resolvedDistDir,
    autoReload: false,
    serveAdminPanel: false,
  });

  try {
    await strapi.load();

    const { runApplicationSeed } = require(path.join(resolvedDistDir, 'seed'));
    const result = await runApplicationSeed(strapi, {
      allowProduction,
      force,
      source: 'command',
    });

    console.log(
      result.changed
        ? `Seed completed. Version ${result.seedVersion}.`
        : `Seed skipped. Version ${result.seedVersion} is already applied.`,
    );

    await destroySafely(strapi);
    process.exit(0);
  } catch (error) {
    console.error(error);
    await destroySafely(strapi);
    process.exit(1);
  }
}

main();
