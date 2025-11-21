FROM node:22-slim

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Copy entrypoint script
COPY docker-entrypoint-frontend.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 5173

ENTRYPOINT ["/docker-entrypoint.sh"]
