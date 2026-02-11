#!/bin/bash

# Скрипт для деплоя на VPS
# Использование: ./deploy.sh

set -e

echo "🚀 Deploying Pipun VPN Website..."

# Change to project directory
cd /opt/pipun

# Pull latest changes
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Build static files with Hugo
echo "🔨 Building static site with Hugo..."
hugo --minify --cleanDestinationDir

echo "✅ Deployment complete!"
echo "🌐 Site available at https://pipun.club"
