/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        port: '',
        hostname: 'avatars.githubusercontent.com',
        protocol: 'https',
        pathname: '/u/**',
      },
      {
        hostname: 'images.unsplash.com',
        protocol: 'https',
        pathname: '/photo-**',
      },
    ],
  },
}

module.exports = nextConfig
