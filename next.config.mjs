import { withPayload } from '@payloadcms/next/withPayload';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { ppr: 'incremental' },
  images: { domains: ['4.img-dpreview.com'], formats: ['image/avif', 'image/webp'] },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
