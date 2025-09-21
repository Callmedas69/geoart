import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Suppress pino-pretty warnings in development
    config.externals.push("pino-pretty", "lokijs", "encoding")
    
    // Fix for WalletConnect issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      url: require.resolve("url"),
      zlib: require.resolve("browserify-zlib"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      assert: require.resolve("assert"),
      os: require.resolve("os-browserify"),
      path: require.resolve("path-browserify"),
    }

    // Optimize WalletConnect modules to prevent multiple instances
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@walletconnect/core': require.resolve('@walletconnect/core'),
        '@walletconnect/universal-provider': require.resolve('@walletconnect/universal-provider'),
        '@walletconnect/ethereum-provider': require.resolve('@walletconnect/ethereum-provider'),
      }
    }

    // Add module caching optimizations
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          walletconnect: {
            test: /[\\/]node_modules[\\/](@walletconnect|@rainbow-me)[\\/]/,
            name: 'walletconnect',
            chunks: 'all',
            priority: 20,
          },
        },
      },
    }
    
    return config
  },
  // Disable React StrictMode to reduce WalletConnect re-initialization in dev
  reactStrictMode: false,
  
  // Optimize experimental features for better hot reload behavior
  experimental: {
    optimizePackageImports: ['@rainbow-me/rainbowkit', 'wagmi'],
  },

  // 👇 Add rewrites for subdomains
  async rewrites() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "painter.geoart.gallery" }],
        destination: "/painter/",
      },
      {
        source: "/:path",
        has: [{ type: "host", value: "painter.geoart.gallery" }],
        destination: "/painter/:path",
      },
    ];
  },
  
};

export default nextConfig;
