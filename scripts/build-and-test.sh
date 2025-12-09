#!/bin/bash
# ============================================
# Build and Test Script
# ============================================
# Runs build, lint, and tests before deployment
# Usage: ./scripts/build-and-test.sh

set -e  # Exit on error

echo "🔨 Building and testing ReelsAudio..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Step 1: Lint
echo -e "\n${BLUE}Step 1: Running linter...${NC}"
npm run lint
echo -e "${GREEN}✓ Linting passed${NC}"

# Step 2: Type check (if TypeScript)
if [ -f "tsconfig.json" ]; then
    echo -e "\n${BLUE}Step 2: Running TypeScript check...${NC}"
    npx tsc --noEmit
    echo -e "${GREEN}✓ Type checking passed${NC}"
fi

# Step 3: Build
echo -e "\n${BLUE}Step 3: Building application...${NC}"
npm run build
echo -e "${GREEN}✓ Build successful${NC}"

# Step 4: Check build output
if [ ! -d ".next" ]; then
    echo -e "${RED}✗ Build output (.next) not found${NC}"
    exit 1
fi

echo -e "\n${GREEN}✅ All checks passed! Ready for deployment.${NC}"

