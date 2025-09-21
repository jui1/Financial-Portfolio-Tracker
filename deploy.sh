#!/bin/bash

# Portfolio Tracker Deployment Script

set -e

echo "🚀 Starting Portfolio Tracker deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create .env file and update the values."
    exit 1
fi

# Load environment variables
export $(cat .env | xargs)

# Build and start services
echo "📦 Building and starting services..."
docker-compose -f docker-compose.prod.yml up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if services are running
echo "🔍 Checking service health..."
if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "✅ Services are running successfully!"
    echo "🌐 Frontend: http://localhost"
    echo "🔧 Backend API: http://localhost:8087/api"
else
    echo "❌ Some services failed to start. Check logs with: docker-compose -f docker-compose.prod.yml logs"
    exit 1
fi

echo "🎉 Deployment completed successfully!"


