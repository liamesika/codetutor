# Use Node 18 as base (guaranteed modern JS support)
FROM node:18-bullseye

# Install OpenJDK 17
RUN apt-get update && apt-get install -y --no-install-recommends \
    openjdk-17-jdk-headless \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && apt-get clean

# Verify versions at build time
RUN echo "=== BUILD TIME VERSION CHECK ===" \
  && node -v \
  && npm -v \
  && java -version \
  && javac -version \
  && echo "=== END VERSION CHECK ==="

# Set JAVA_HOME
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH="${JAVA_HOME}/bin:${PATH}"

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application code
COPY . .

# Production environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start the server
CMD ["node", "server.js"]
