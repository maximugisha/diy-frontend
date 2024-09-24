/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: '127.0.0.1',
          pathname: '/media/**', // Path to the images
        },
        {
            protocol: 'https',
            hostname: 'kids-49ee77c1-f112-45e6-9897.renu-01.cranecloud.io',
            pathname: '/media/**',
          },
      ],
    },
  };

export default nextConfig;
