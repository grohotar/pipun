#!/bin/bash

# Скрипт для деплоя на VPS
# Использование: ./deploy.sh

set -e

echo "🚀 Deploying Pipun VPN Website..."

# Pull latest changes
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Build static files with Hugo in Docker
echo "🔨 Building static site with Hugo..."
docker compose --profile build run --rm hugo-builder

# Restart nginx to apply changes
echo "🔄 Restarting nginx..."
docker restart remnawave-nginx

echo "✅ Deployment complete!"
echo "🌐 Site should be available at https://pipun.pro"
