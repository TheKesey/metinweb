#!/bin/sh
# Kesey — Frontend indító szkript (FreeBSD + Next.js + PM2)

FRONTEND_DIR="/var/www/kesey/frontend"
APP_NAME="kesey-frontend"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { printf "${GREEN}[OK]${NC} %s\n" "$1"; }
warn() { printf "${YELLOW}[!!]${NC} %s\n" "$1"; }
fail() { printf "${RED}[ERR]${NC} %s\n" "$1"; exit 1; }

cd "$FRONTEND_DIR" || fail "Frontend mappa nem található: $FRONTEND_DIR"

# Függőségek
warn "npm install..."
npm install --silent && log "Függőségek telepítve"

# Build
warn "Next.js build (ez eltarthat 1-2 percig)..."
npm run build || fail "Build sikertelen"
log "Build kész"

# Apache ellenőrzés (proxy miatt kell)
if service apache24 status > /dev/null 2>&1; then
  log "Apache fut"
else
  warn "Apache leállva — indítás..."
  service apache24 start || fail "Apache nem indult el"
  log "Apache elindult"
fi

# PM2
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  warn "PM2 process már fut — újraindítás..."
  pm2 restart "$APP_NAME" && log "PM2 újraindítva"
else
  warn "PM2 process indítása..."
  pm2 start npm --name "$APP_NAME" -- start && log "PM2 elindult"
  pm2 save && log "PM2 állapot mentve"
fi

IP=$(hostname -I 2>/dev/null | awk '{print $1}')
printf "\n${GREEN}Frontend kész.${NC} Elérhető: http://${IP}:80\n"
printf "PM2 logok: pm2 logs ${APP_NAME}\n"
