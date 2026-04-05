import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Pure static `out/` — fixes Vercel NOT_FOUND when project was treated as plain static / wrong output. */
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
