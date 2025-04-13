# -----------------------------------------------------------
# Stage 1: Builder
# -----------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# 1) Install pnpm globally
RUN npm install -g pnpm

# 2) Copy package files & install dependencies with pnpm
COPY package.json tsconfig.json ./
RUN pnpm install

# 3) Copy your custom node source
COPY ./custom_nodes ./custom_nodes

# 4) Build your TypeScript files
RUN pnpm run build

# -----------------------------------------------------------
# Stage 2: Final Image
# -----------------------------------------------------------
FROM n8nio/n8n:latest

USER root

# Copy built files to the correct location
COPY --from=builder /app/dist /tmp/custom-nodes-backup
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

# Ensure correct permissions
RUN mkdir -p /home/node/.n8n/custom
RUN chown -R node:node /home/node/.n8n/custom
USER node

# Configure n8n
ENV N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/custom
ENV N8N_COMMUNITY_PACKAGES_ENABLED=true
ENV N8N_LOG_LEVEL=debug