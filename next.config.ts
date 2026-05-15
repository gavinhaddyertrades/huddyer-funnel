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
        destination: "https://huddyertrades.biz?utm_source=discord",
        permanent: true,
      },
      {
        source: "/tt",
        destination: "https://huddyertrades.biz?utm_source=tiktok",
        permanent: true,
      },
      {
        source: "/lt",
        destination: "https://huddyertrades.biz?utm_source=linktree",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
