/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
        {
          protocol: 'http',
          hostname: '**',
        },
      ],
      minimumCacheTTL: 60,
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      formats: ['image/webp'],
      dangerouslyAllowSVG: true,
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    env: {
      GITHUB_TOKEN: process.env.GITHUB_TOKEN,
      USER_WHITELIST: process.env.USER_WHITELIST,
      LLM_API_KEY: process.env.LLM_API_KEY,
      LLM_API_URL: process.env.LLM_API_URL,
      ACCESS_PASSWORD: process.env.ACCESS_PASSWORD,
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
          config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            stream: false,
            crypto: false,
          };
        }
        return config;
      },
  }
  
  export default nextConfig