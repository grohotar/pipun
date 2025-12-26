#!/bin/bash

# Скрипт для деплоя на VPS
# Использование: ./deploy.sh

set -e

echo "🚀 Deploying Pipun VPN Website..."

# Pull latest changes
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Build and restart container
echo "🔨 Building Docker image..."
docker-compose build

echo "🔄 Restarting container..."
docker-compose down
docker-compose up -d

echo "✅ Deployment complete!"
echo "🌐 Site should be available at http://pipun.pro"
