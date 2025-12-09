#!/bin/bash
# ============================================
# Development Setup Script
# ============================================
# Run this script to set up your development environment
# Usage: ./scripts/dev-setup.sh

set -e  # Exit on error

echo "🚀 Setting up ReelsAudio development environment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js is not installed. Please install Node.js 20+ first.${NC}"
    exit 1
fi

echo -e "${BLUE}✓ Node.js version:$(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}⚠️  npm is not installed.${NC}"
    exit 1
fi

echo -e "${BLUE}✓ npm version:$(npm --version)${NC}"

# Install dependencies
echo -e "\n${BLUE}📦 Installing dependencies...${NC}"
npm install

# Check if Docker is installed (optional)
if command -v docker &> /dev/null; then
    echo -e "\n${BLUE}🐳 Docker is installed${NC}"
    echo -e "${BLUE}   Version:$(docker --version)${NC}"
    
    if command -v docker-compose &> /dev/null; then
        echo -e "${BLUE}✓ Docker Compose is installed${NC}"
    fi
else
    echo -e "\n${YELLOW}⚠️  Docker is not installed (optional for local development)${NC}"
fi

# Check if kubectl is installed (optional)
if command -v kubectl &> /dev/null; then
    echo -e "\n${BLUE}☸️  kubectl is installed${NC}"
    echo -e "${BLUE}   Version:$(kubectl version --client --short)${NC}"
else
    echo -e "\n${YELLOW}⚠️  kubectl is not installed (optional for Kubernetes)${NC}"
fi

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo -e "\n${BLUE}📝 Creating .env.local file...${NC}"
    cat > .env.local << EOF
# Development Environment Variables
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
PORT=3000
EOF
    echo -e "${GREEN}✓ Created .env.local${NC}"
else
    echo -e "\n${BLUE}✓ .env.local already exists${NC}"
fi

# Run linting
echo -e "\n${BLUE}🔍 Running linter...${NC}"
npm run lint || echo -e "${YELLOW}⚠️  Linter found some issues (non-blocking)${NC}"

echo -e "\n${GREEN}✅ Development environment setup complete!${NC}"
echo -e "\n${BLUE}Next steps:${NC}"
echo -e "  1. Run ${GREEN}npm run dev${NC} to start development server"
echo -e "  2. Run ${GREEN}docker-compose up${NC} to start with Docker"
echo -e "  3. Read ${GREEN}DEVOPS_GUIDE.md${NC} to learn about DevOps"

