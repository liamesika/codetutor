import * as Sentry from "@sentry/nextjs"

// Only initialize Sentry if DSN is configured
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Capture 100% of transactions for performance monitoring
    tracesSampleRate: 1.0,

    // Set a lower sample rate in production
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Only enable in production
    enabled: process.env.NODE_ENV === "production",

  // Capture user information
  beforeSend(event) {
    // Sanitize sensitive data
    if (event.request?.headers) {
      delete event.request.headers["authorization"]
      delete event.request.headers["cookie"]
    }
    return event
  },

  // Add tags for filtering
  initialScope: {
    tags: {
      app: "codetutor",
      component: "client",
    },
  },

    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  })
}
