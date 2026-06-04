import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProd ? '/github-profile-analyzer' : '',
  images: {
    unoptimized: true, // Required for static HTML export
  },
};

export default nextConfig;

