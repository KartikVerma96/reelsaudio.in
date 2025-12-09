#!/bin/bash
# ============================================
# Docker Build Script
# ============================================
# Builds Docker image with proper tagging
# Usage: ./scripts/docker-build.sh [tag]

set -e

IMAGE_NAME="reelsaudio"
TAG=${1:-latest}
FULL_IMAGE_NAME="${IMAGE_NAME}:${TAG}"

echo "🐳 Building Docker image: ${FULL_IMAGE_NAME}"

# Build image
docker build -t ${FULL_IMAGE_NAME} .

# Also tag as latest if not already
if [ "$TAG" != "latest" ]; then
    docker tag ${FULL_IMAGE_NAME} ${IMAGE_NAME}:latest
fi

echo "✅ Docker image built successfully!"
echo ""
echo "To run:"
echo "  docker run -p 3000:3000 ${FULL_IMAGE_NAME}"
echo ""
echo "To push (if using registry):"
echo "  docker tag ${FULL_IMAGE_NAME} ghcr.io/YOUR_USERNAME/${IMAGE_NAME}:${TAG}"
echo "  docker push ghcr.io/YOUR_USERNAME/${IMAGE_NAME}:${TAG}"

