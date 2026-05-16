# Kesey — Production deployment (FreeBSD + Apache)

## Stack

| Réteg | Technológia |
|---|---|
| Webszerver | Apache 2.4 |
| Backend | Laravel 12, PHP 8.2 |
| Frontend | Next.js, Node.js, PM2 |
| Adatbázis | MariaDB 11.8 |
| OS | FreeBSD |

## Portok (domain nélkül, IP alapon)

| Szolgáltatás | Port |
|---|---|
| Frontend (Next.js) | `http://IP:3000` |
| Backend (Laravel API) | `http://IP:8000` |

---

## 1. Csomagok telepítése

```bash
sudo pkg update
sudo pkg install -y apache24 mod_php83 php83 php83-pdo_mysql \
  php83-mbstring php83-xml php83-curl php83-zip php83-bcmath \
  php83-intl php83-filter mariadb118-server node npm git composer
sudo npm install -g pm2
```

## 2. Service-ek engedélyezése

```bash
sudo sysrc apache24_enable="YES"
sudo sysrc mysql_enable="YES"   # MariaDB is a mysql-compatible service
```

## 3. MariaDB beállítása

```bash
sudo service mysql start
sudo mysql_secure_installation
sudo mysql -u root -p
```

```sql
CREATE DATABASE kesey_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'kesey'@'localhost' IDENTIFIED BY 'eros_jelszo';
GRANT ALL PRIVILEGES ON kesey_db.* TO 'kesey'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 4. Projekt feltöltése

```bash
sudo mkdir -p /var/www/kesey
sudo chown $USER:$USER /var/www/kesey
git clone https://github.com/te/repo.git /var/www/kesey
```

## 5. Backend (Laravel) beállítása

```bash
cd /var/www/kesey/backend
composer install --no-dev --optimize-autoloader
cp .env.example .env
```

**`.env` szerkesztése:**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=http://SZERVER_IP:8000

DB_DATABASE=kesey_db
DB_USERNAME=kesey
DB_PASSWORD=eros_jelszo
```

```bash
php artisan key:generate
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**Jogosultságok:**
```bash
sudo chown -R www:www /var/www/kesey/backend
sudo chmod -R 775 /var/www/kesey/backend/storage
sudo chmod -R 775 /var/www/kesey/backend/bootstrap/cache
```

## 6. Frontend (Next.js) beállítása

```bash
cd /var/www/kesey/frontend
npm install
npm run build
```

**`.env.local` létrehozása:**
```env
NEXT_PUBLIC_API_URL=http://SZERVER_IP:8000
```

## 7. Apache konfig

Apache FreeBSD-n: `/usr/local/etc/apache24/`

**Backend** — `/usr/local/etc/apache24/Includes/kesey-backend.conf`:
```apache
Listen 8000

<VirtualHost *:8000>
    DocumentRoot /var/www/kesey/backend/public

    <Directory /var/www/kesey/backend/public>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog /var/log/kesey-backend-error.log
    CustomLog /var/log/kesey-backend-access.log combined
</VirtualHost>
```

**Backend** konfig után indítsd újra Apache-ot:
```bash
sudo service apache24 start
```

> A frontend Next.js közvetlenül a 3000-es porton fut PM2 alatt — Apache proxy nem kell hozzá.

## 8. Tűzfal (pf)

Ha `pf` fut (`/etc/pf.conf`):
```
pass in proto tcp to port { 22, 3000, 8000 }
```
```bash
sudo pfctl -f /etc/pf.conf
```

## 9. PM2 automatikus indítás reboot után

```bash
pm2 start npm --name "kesey-frontend" -- start
pm2 save
pm2 startup
# A kiírt parancsot másold be és futtasd le
```

---

## Frissítés (deploy)

```bash
cd /var/www/kesey
git pull

# Backend
cd backend
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Frontend
cd ../frontend
npm install
npm run build
pm2 restart kesey-frontend
```

---

## Szkriptek

| Fájl | Leírás |
|---|---|
| `start-backend.sh` | MySQL + Apache indítása, Laravel cache rebuild |
| `start-frontend.sh` | Next.js build + PM2 indítás/újraindítás |

A szkripteket másold a szerverre (pl. `/root/` vagy `/var/www/kesey/`), majd:
```bash
chmod +x start-backend.sh start-frontend.sh
```
