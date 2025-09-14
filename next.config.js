/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/wp-content/uploads/**',
      },
      // Optionally allow production WP domain
      process.env.WOO_BASE_URL ? (() => {
        try {
          const u = new URL(process.env.WOO_BASE_URL);
          return {
            protocol: u.protocol.replace(':', ''),
            hostname: u.hostname,
            pathname: '/wp-content/uploads/**',
          };
        } catch {
          return null;
        }
      })() : null,
    ].filter(Boolean),
  },
};

module.exports = nextConfig;
