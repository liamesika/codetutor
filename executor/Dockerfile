FROM eclipse-temurin:17-jdk-alpine

RUN apk add --no-cache nodejs npm

WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY server.js ./

EXPOSE 3001
CMD ["node", "server.js"]
