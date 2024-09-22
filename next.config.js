/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [`raw.githubusercontent.com`],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  env: {
    NEXT_PRIVY_APP_ID: process.env.NEXT_PRIVY_APP_ID || "",
    NEXT_PRIVY_SECRET: process.env.NEXT_PRIVY_SECRET || "",
    NEXT_BIRDEYE_API_KEY: process.env.NEXT_BIRDEYE_API_KEY || "",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
