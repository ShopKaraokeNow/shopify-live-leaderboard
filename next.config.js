/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Allow embedding in Shopify
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL'
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors * 'self' https://*.myshopify.com https://*.shopify.com"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;