import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/github-dev-card",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
