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
    NEXT_RPC_MAINNET_URL: process.env.NEXT_RPC_MAINNET_URL || "",
    NEXT_RPC_DEVNET_URL: process.env.NEXT_RPC_DEVNET_URL || "",
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["grammy"],
  },
};

module.exports = nextConfig;
