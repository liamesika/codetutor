import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Capture 100% of transactions for performance monitoring
  tracesSampleRate: 1.0,

  // Only enable in production
  enabled: process.env.NODE_ENV === "production",

  // Sanitize sensitive data
  beforeSend(event) {
    // Remove sensitive headers
    if (event.request?.headers) {
      delete event.request.headers["authorization"]
      delete event.request.headers["cookie"]
    }
    // Remove sensitive data from breadcrumbs
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
        if (breadcrumb.data?.password) {
          breadcrumb.data.password = "[REDACTED]"
        }
        if (breadcrumb.data?.code) {
          // Truncate long code snippets
          breadcrumb.data.code = breadcrumb.data.code.slice(0, 500)
        }
        return breadcrumb
      })
    }
    return event
  },

  // Add tags for filtering
  initialScope: {
    tags: {
      app: "codetutor",
      component: "server",
    },
  },
})
