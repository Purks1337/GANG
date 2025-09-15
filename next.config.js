const path = require('path');

/** @type {import('next').NextConfig} */

// Helper function to extract hostname from a URL
const getHostname = (url) => {
  try {
    return new URL(url).hostname;
  } catch (error) {
    // Return a default or placeholder if the URL is invalid
    // This might happen during build time if the env var is not set
    // console.warn('Invalid STRAPI_API_URL for image hostname:', error.message);
    return '127.0.0.1';
  }
};

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'api-31.130.144.157.nip.io',
        port: '1337',
        pathname: '/uploads/**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    // This is needed to allow Next.js to handle images from the Strapi backend.
    // The default Next.js image loader only supports HTTP/HTTPS.
    // This configuration tells Next.js to allow images from any origin.
    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif|svg|webp)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192, // 8KB
            fallback: 'file-loader',
            publicPath: '/_next/static/images/',
            outputPath: 'static/images/',
            name: '[name]-[hash].[ext]',
          },
        },
      ],
    });
    return config;
  },
};

module.exports = nextConfig;
