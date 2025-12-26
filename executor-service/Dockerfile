FROM node:20-slim

# Install OpenJDK
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk-headless \
    && rm -rf /var/lib/apt/lists/*

# Set Java home
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH="${JAVA_HOME}/bin:${PATH}"

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY server.js ./

EXPOSE 3001

CMD ["node", "server.js"]
