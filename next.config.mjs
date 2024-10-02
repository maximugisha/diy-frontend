/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maxicodes.com',
        port: '8000', // Add the port number if it's non-default (optional for port 80)
        pathname: '/media/**', // Match all media files in this folder
      },
    ],
  },
};

export default nextConfig;