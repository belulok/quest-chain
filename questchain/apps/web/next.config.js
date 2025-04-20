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
      include: [/node_modules\/phaser/],
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
        },
      },
    });

    // Enable importing of shader files
    config.module.rules.push({
      test: /\.(frag|vert)$/,
      use: 'raw-loader',
    });

    // Important: return the modified config
    return config;
  },
};

module.exports = nextConfig;
