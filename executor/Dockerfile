FROM eclipse-temurin:17-jdk-jammy

RUN apt-get update && apt-get install -y nodejs npm && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY server.js ./

EXPOSE 3001
CMD ["node", "server.js"]
