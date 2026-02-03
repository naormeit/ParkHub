import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* output: "export", */ // Comment this out or delete it
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;