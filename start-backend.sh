#!/bin/sh
# Kesey — Backend indító szkript (FreeBSD + Apache + Laravel)

BACKEND_DIR="/var/www/metinweb/backend"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { printf "${GREEN}[OK]${NC} %s\n" "$1"; }
warn() { printf "${YELLOW}[!!]${NC} %s\n" "$1"; }
fail() { printf "${RED}[ERR]${NC} %s\n" "$1"; exit 1; }

# MariaDB
if service mysql-server status > /dev/null 2>&1; then
  log "MariaDB fut"
else
  warn "MariaDB leállva — indítás..."
  service mysql-server start || fail "MariaDB nem indult el"
  log "MariaDB elindult"
fi

# Apache
if service apache24 status > /dev/null 2>&1; then
  log "Apache fut"
else
  warn "Apache leállva — indítás..."
  service apache24 start || fail "Apache nem indult el"
  log "Apache elindult"
fi

# Laravel cache rebuild
cd "$BACKEND_DIR" || fail "Backend mappa nem található: $BACKEND_DIR"

warn "Laravel cache újraépítése..."
php artisan config:cache  && log "config:cache"
php artisan route:cache   && log "route:cache"
php artisan view:cache    && log "view:cache"

# Jogosultságok
chown -R www:www "$BACKEND_DIR/storage" "$BACKEND_DIR/bootstrap/cache"
chmod -R 775 "$BACKEND_DIR/storage" "$BACKEND_DIR/bootstrap/cache"
log "Jogosultságok beállítva"

IP=$(ifconfig | awk '/inet / && !/127\.0\.0\.1/ {print $2; exit}')
printf "\n${GREEN}Backend kész.${NC} Elérhető: http://${IP}:8000\n"
