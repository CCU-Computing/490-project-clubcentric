FROM node:22-slim

# Set working directory
WORKDIR /app

# The node:22-slim image already has a 'node' user (UID 1000, GID 1000)
# We'll use that existing user instead of creating a new one

# Copy package files
COPY frontend/package*.json ./

# Copy entrypoint script
COPY docker-entrypoint-frontend.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Change ownership to node user
RUN chown -R node:node /app /docker-entrypoint.sh

# Switch to the node user
USER node

EXPOSE 5173

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]
