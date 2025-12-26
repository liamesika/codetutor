# Java Sandbox - Isolated execution environment
FROM eclipse-temurin:17-jdk-alpine

# Create non-root user for security
RUN addgroup -S sandbox && adduser -S sandbox -G sandbox

# Set up working directory
WORKDIR /sandbox

# Install timeout utility
RUN apk add --no-cache coreutils

# Create temp directories
RUN mkdir -p /sandbox/work && chown -R sandbox:sandbox /sandbox

# Security: Remove network tools
RUN rm -rf /usr/bin/wget /usr/bin/curl 2>/dev/null || true

# Switch to non-root user
USER sandbox

# Copy execution script
COPY --chown=sandbox:sandbox execute.sh /sandbox/execute.sh
RUN chmod +x /sandbox/execute.sh

# Set resource limits via entrypoint
ENTRYPOINT ["/sandbox/execute.sh"]
