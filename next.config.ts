import type { NextConfig } from "next"
import { withSentryConfig } from "@sentry/nextjs"

const nextConfig: NextConfig = {
  // Disable sourcemaps in production to prevent 404s
  productionBrowserSourceMaps: false,

  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },

  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  // Redirects for canonical routes
  async redirects() {
    return [
      // Legacy practice route -> canonical practice route
      {
        source: "/learn/:topicId/practice/:questionId",
        destination: "/practice/:questionId",
        permanent: true, // 308 redirect
      },
    ]
  },

  // Headers for security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ]
  },
}

// Sentry configuration
const sentryWebpackPluginOptions = {
  // Organization and project names from Sentry
  org: process.env.SENTRY_ORG || "codetutor",
  project: process.env.SENTRY_PROJECT || "codetutor",

  // Auth token for uploading source maps
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Only upload source maps in production
  silent: true,
  hideSourceMaps: true,

  // Disable telemetry
  telemetry: false,
}

// Export with or without Sentry based on configuration
export default process.env.SENTRY_DSN
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
  : nextConfig
