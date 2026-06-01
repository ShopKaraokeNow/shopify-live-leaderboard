/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://*.myshopify.com'
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.myshopify.com https://*.shopify.com https://shopify-live-leaderboard.vercel.app"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
module.exports = nextConfig;