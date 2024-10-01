/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '147.182.223.147',
        pathname: '/media/**', // Path to the images
      },
      {
        protocol: 'https',
        hostname: '147.182.223.147',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
