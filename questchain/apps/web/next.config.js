/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["shared-ui"],
  images: {
    domains: ['ipfs.io', 'nftstorage.link'],
  },
  webpack: (config) => {
    // Add support for importing Phaser
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/phaser/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
        },
      },
    });
    return config;
  },
};

module.exports = nextConfig;
