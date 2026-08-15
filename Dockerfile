# Stage 1: Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package manifests and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy application source code
COPY . .

# Build static production assets into /app/dist
RUN npm run build

# Stage 2: Production serve stage using Nginx
FROM nginx:alpine

# Default port for Cloud Run (overridden dynamically by Cloud Run at runtime)
ENV PORT=8080

# Copy static built assets to Nginx web root
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx config template to support dynamic $PORT substitution on Cloud Run
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Expose default port
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
