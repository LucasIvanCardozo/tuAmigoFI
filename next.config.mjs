/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    transpilePackages: ['highlight.js'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
