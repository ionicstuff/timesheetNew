#!/usr/bin/env sh
set -eu

: "${BACKEND_URL:=http://localhost:3000}"

# Render nginx config from template with the current BACKEND_URL
envsubst '${BACKEND_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx in foreground
exec nginx -g 'daemon off;'
