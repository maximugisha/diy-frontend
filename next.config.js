module.exports = {
  images: {
    // Defaults are:
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Default widths to be generated
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // For fixed sizes
    domains: ['maxicodes.com', 'api.maxicodes.com'], // No external domains allowed by default
    path: '/_next/image', // Path for image optimization
    loader: 'default', // Default loader is Next.js' built-in loader
  },
};