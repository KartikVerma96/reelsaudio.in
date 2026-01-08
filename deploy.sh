#!/bin/bash

# Quick Deployment Script for freereelsdownload.com
# Run this script on your VPS after initial setup

set -e

echo "🚀 Starting deployment for freereelsdownload.com..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root or use sudo${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Updating system...${NC}"
apt update && apt upgrade -y

echo -e "${YELLOW}Step 2: Installing Node.js 20.x...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

echo -e "${YELLOW}Step 3: Installing Python and yt-dlp...${NC}"
apt install -y python3 python3-pip python3-venv python3-full pipx
pipx install yt-dlp
# Make yt-dlp available system-wide
pipx ensurepath

echo -e "${YELLOW}Step 4: Installing FFmpeg...${NC}"
apt install -y ffmpeg

echo -e "${YELLOW}Step 5: Installing PM2...${NC}"
npm install -g pm2

echo -e "${YELLOW}Step 6: Installing Nginx...${NC}"
apt install -y nginx

echo -e "${YELLOW}Step 7: Installing Certbot...${NC}"
apt install -y certbot python3-certbot-nginx

echo -e "${GREEN}✅ All dependencies installed!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Clone your repository:"
echo "   cd /var/www"
echo "   git clone YOUR_REPO_URL freereelsdownload"
echo "   cd freereelsdownload"
echo ""
echo "2. Create .env.production file:"
echo "   nano .env.production"
echo "   Add: NEXT_PUBLIC_SITE_URL=https://freereelsdownload.com"
echo ""
echo "3. Install dependencies and build:"
echo "   npm install"
echo "   npm run build"
echo ""
echo "4. Start with PM2:"
echo "   pm2 start npm --name 'freereelsdownload' -- start"
echo "   pm2 save"
echo "   pm2 startup  # Follow the command it outputs"
echo ""
echo "5. Configure Nginx (see DEPLOYMENT_STEPS.md)"
echo ""
echo "6. Setup SSL:"
echo "   sudo certbot --nginx -d freereelsdownload.com -d www.freereelsdownload.com"
echo ""
echo -e "${GREEN}Deployment script completed!${NC}"

