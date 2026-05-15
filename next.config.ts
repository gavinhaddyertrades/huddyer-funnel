import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/yt",
        destination: "https://huddyertrades.biz?utm_source=youtube",
        permanent: true,
      },
      {
        source: "/ig",
        destination: "https://huddyertrades.biz?utm_source=instagram",
        permanent: true,
      },
      {
        source: "/mc",
        destination: "https://huddyertrades.biz?utm_source=manychat",
        permanent: true,
      },
      {
        source: "/disc",
        destination: "https://huddyertrades.biz?utm_source=discord&utm_medium=community",
        permanent: true,
      },
      {
        source: "/tt",
        destination: "https://huddyertrades.biz?utm_source=tiktok&utm_medium=bio",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
