import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/yt",
        destination: "https://huddyertrades.biz?utm_source=youtube",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
