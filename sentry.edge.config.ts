import * as Sentry from "@sentry/nextjs"

// Only initialize Sentry if DSN is configured
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,

    tracesSampleRate: 1.0,

    enabled: process.env.NODE_ENV === "production",

    initialScope: {
      tags: {
        app: "codetutor",
        component: "edge",
      },
    },
  })
}
