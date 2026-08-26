<<<<<<< HEAD
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vknetjgebapvlncovblp.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
  },
=======
/*
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
>>>>>>> workshop
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