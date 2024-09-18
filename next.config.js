/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      NEXT_PRIVY_APP_ID: process.env.NEXT_PRIVY_APP_ID || "",
      NEXT_PRIVY_SECRET: process.env.NEXT_PRIVY_SECRET || "",
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
  };
  
  module.exports = nextConfig;
  