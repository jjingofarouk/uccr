/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        crypto: false,
        events: false,
        os: false,
        'fs/promises': false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;