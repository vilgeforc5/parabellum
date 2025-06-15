import { withPayload } from '@payloadcms/next/withPayload';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { ppr: 'incremental' },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
