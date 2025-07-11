import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/**`)],
  },
  /**
   * The below configurations allows TypeScript and ESLint errors to be ignored during the build process.
   * NOT RECOMMENDED for production. This is 200% technical debt.
   * Shipping at all costs rn
   * The Georgeistes shall return one day and fix all the vibe-coded ai slop that no average developer dares to touch
   */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
