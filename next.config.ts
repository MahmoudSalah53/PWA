import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  // disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default withPWA(nextConfig);