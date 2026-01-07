/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'tripemilestone.in-maa-1.linodeobjects.com',
      },
    ],
  },
};

export default nextConfig;
