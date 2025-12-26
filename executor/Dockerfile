FROM eclipse-temurin:17-jdk-jammy

RUN apt-get update && apt-get install -y curl ca-certificates && rm -rf /var/lib/apt/lists/* \
  && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
  && apt-get update && apt-get install -y nodejs \
  && node -v && npm -v

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node","server.js"]
