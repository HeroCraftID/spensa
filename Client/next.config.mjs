/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable environment variables to be available on the client
  env: {
    ACCESS_START_HOUR: process.env.ACCESS_START_HOUR,
    ACCESS_START_MINUTE: process.env.ACCESS_START_MINUTE,
    ACCESS_END_HOUR: process.env.ACCESS_END_HOUR,
    ACCESS_END_MINUTE: process.env.ACCESS_END_MINUTE,
    ACCESS_TIMEZONE_OFFSET: process.env.ACCESS_TIMEZONE_OFFSET,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  basePath: "/admin/education/spensa/821022/absen",
  assetPrefix: "/admin/education/spensa/821022/absen",
  trailingSlash: true,
};

export default nextConfig;
