import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Assure l'utilisation de Node.js runtime pour routes qui le demandent
    runtime: "nodejs",
  },
};

export default nextConfig;
