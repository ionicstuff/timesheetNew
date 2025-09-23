# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy the rest of the source and build
COPY . .

# Optional: allow build-time override for Vite public API base (if your app uses it)
# Pass at build time: --build-arg VITE_API_BASE_URL=https://api.example.com
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# Runtime stage
FROM nginx:1.27-alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx template and entrypoint to inject BACKEND_URL at runtime and set SPA fallback
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY nginx/docker-entrypoint.sh /docker-entrypoint.sh
# Normalize Windows line endings (CRLF) and ensure executable bit
RUN sed -i 's/\r$//' /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

# Default to backend on http://localhost:3000 (override with -e BACKEND_URL=...)
ENV BACKEND_URL=http://15.206.209.204:3000
EXPOSE 80

CMD ["/docker-entrypoint.sh"]
