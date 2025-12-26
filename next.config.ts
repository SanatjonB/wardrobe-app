import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qmtcyxcaiczaneqkjnvm.supabase.co",
        pathname: "/storage/v1/object/public/garments/**",
      },
    ],
  },
};

export default nextConfig;
