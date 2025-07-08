/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Image configuration
  images: {
    domains: ['res.cloudinary.com'],
    unoptimized: true, // Helps with static generation
  },
  
  // Webpack configuration for client-side fallbacks
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
        // Additional Firebase-related fallbacks
        http: false,
        https: false,
        url: false,
        zlib: false,
        stream: false,
        util: false,
        buffer: false,
        assert: false,
      };
    }
    return config;
  },
  
  // Server external packages
  serverExternalPackages: ['react-quill', 'cloudinary', 'dompurify', 'jsdom'],
  
  // Ensure proper static generation
  trailingSlash: true,
  
  // Handle build output
  output: 'standalone', // Helps with deployment
  
  // Handle environment variables properly
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },
  
  // Optimize for static site generation
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@mui/material'],
  },
  
  // Handle redirects and rewrites if needed
  async redirects() {
    return [
      // Add any redirects here if needed
    ];
  },
};

export default nextConfig;