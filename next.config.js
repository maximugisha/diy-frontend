module.exports = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.maxicodes.com',
        pathname: '/media/**',
      },
    ],
    domains: ['maxicodes.com', 'api.maxicodes.com'], // List your image domains
    path: '/_next/image',
    loader: 'default',
  },
};
