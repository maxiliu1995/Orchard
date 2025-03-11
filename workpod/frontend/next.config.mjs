/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for development
  reactStrictMode: true,
  
  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Enable image optimization
  images: {
    domains: [
      'localhost',
      // Add other image domains here if needed
    ],
  },
  
  // Environment variables that should be exposed to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  // Enable experimental features if needed
  experimental: {
    // serverActions: true,
    // typedRoutes: true,
  },

  // Configure webpack if needed
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add custom webpack config here if needed
    return config;
  },
};

export default nextConfig;