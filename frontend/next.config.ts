import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  reactStrictMode: false, //Default: true -> false Fix: https://github.com/zenoamaro/react-quill/issues/784
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      }
      /**
       * Hien thi anh dai dien login google
       */
      // {
      //   protocol: 'https',
      //   hostname: 'lh3.googleusercontent.com',
      // },
    ],
  },
};

export default nextConfig;
