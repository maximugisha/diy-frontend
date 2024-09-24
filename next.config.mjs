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
            hostname: 'cranecloud.io',
            pathname: '/media/**',
          },
      ],
    },
  };

export default nextConfig;
