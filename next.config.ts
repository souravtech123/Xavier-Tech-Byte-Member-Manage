import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }, { protocol: 'http', hostname: '**' }],
  },
};

export default nextConfig;
