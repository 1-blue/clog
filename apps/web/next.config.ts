import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["@clog/db", "@clog/utils"],
};

export default nextConfig;
