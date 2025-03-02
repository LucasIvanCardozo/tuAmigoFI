/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    transpilePackages: ['package-name'],
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
