import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Pure static `out/` — fixes Vercel NOT_FOUND when project was treated as plain static / wrong output. */
  output: "export",
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
