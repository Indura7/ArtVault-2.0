/*
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
};

export default nextConfig; */


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vknetjgebapvlncovblp.supabase.co",
      },
    ],
  },
};

export default nextConfig;