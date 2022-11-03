/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'peer-ec1.decentraland.org',
        pathname: '/content/contents/**',
      },
    ],
  }
}

module.exports = nextConfig
