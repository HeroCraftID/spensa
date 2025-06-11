/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload", // HSTS header
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/admin/education/spensa/821022/absen/:path*',
        destination: '/:path*',
      },
    ];
  },
  assetPrefix: '/',

};

export default nextConfig;
