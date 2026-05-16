#!/bin/sh
# Kesey — Frontend indító szkript (FreeBSD + Next.js + PM2)
# Build a fejlesztői gépen történik (SWC FreeBSD-n nem támogatott),
# ide csak a kész .next mappa kerül feltöltésre.

FRONTEND_DIR="/var/www/metinweb/frontend"
APP_NAME="kesey-frontend"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { printf "${GREEN}[OK]${NC} %s\n" "$1"; }
warn() { printf "${YELLOW}[!!]${NC} %s\n" "$1"; }
fail() { printf "${RED}[ERR]${NC} %s\n" "$1"; exit 1; }

cd "$FRONTEND_DIR" || fail "Frontend mappa nem található: $FRONTEND_DIR"

# .next mappa ellenőrzés
if [ ! -d ".next" ]; then
  fail ".next mappa hiányzik — előbb build-eld a fejlesztői gépen és töltsd fel (scp -r .next ...)"
fi

# Csak prod dependencies
warn "npm install (prod only)..."
npm install --omit=dev --silent && log "Függőségek telepítve"

# PM2
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  warn "PM2 process már fut — újraindítás..."
  pm2 restart "$APP_NAME" && log "PM2 újraindítva"
else
  warn "PM2 process indítása..."
  pm2 start npm --name "$APP_NAME" -- start && log "PM2 elindult"
  pm2 save && log "PM2 állapot mentve"
fi

IP=$(ifconfig | awk '/inet / && !/127\.0\.0\.1/ {print $2; exit}')
printf "\n${GREEN}Frontend kész.${NC} Elérhető: http://${IP}:3000\n"
printf "PM2 logok: pm2 logs ${APP_NAME}\n"
