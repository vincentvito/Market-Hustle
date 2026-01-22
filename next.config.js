/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fix webpack cache corruption during hot reload
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false
    }
    return config
  },
}

module.exports = nextConfig
