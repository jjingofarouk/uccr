Update /** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        child_process: false,
        fs: false,
        crypto: false,
        events: false,
        os: false,
        'fs/promises': false,
      };
    }
    return config;
  },
  serverExternalPackages: ['react-quill', 'cloudinary', 'dompurify', 'jsdom'],
};

export default nextConfig;