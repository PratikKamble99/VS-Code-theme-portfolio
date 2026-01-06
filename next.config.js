/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize images and fonts
  images: {
    formats: ['image/webp', 'image/avif'],
    unoptimized: true, // Required for static export
  },
  
  // Enable compression
  compress: true,
  
  // Optimize bundle
  swcMinify: true,
  
  // Optimize fonts
  optimizeFonts: true,
}

module.exports = nextConfig