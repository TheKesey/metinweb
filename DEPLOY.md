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
  php83-intl php83-filter php83-fileinfo php83-bcmath php83-curl php83-pdo_mysql \
  mariadb118-server node npm git
sudo npm install -g pm2
```

**Composer manuális telepítése** (FreeBSD pkg-ban nincs):
```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
chmod +x /usr/local/bin/composer
composer --version   # ellenőrzés
```

## 2. Service-ek engedélyezése

```bash
sudo sysrc apache24_enable="YES"
sudo sysrc mysql_server_enable="YES"
```

## 3. MariaDB beállítása

```bash
sudo service mysql-server start
sudo mysql_secure_installation
sudo mysql -u root -p
```

A Metin2 szerver adatbázisai (`account`, `common`, `log`, `player`) már léteznek.
Csak a Laravel web adatbázisát kell létrehozni, és a usernek olvasási jogot adni a game DB-kre:

```sql
-- Web adatbázis (Laravel)
CREATE DATABASE web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Laravel user
CREATE USER 'laravel'@'localhost' IDENTIFIED BY 'eros_jelszo';

-- Teljes jog a web DB-re
GRANT ALL PRIVILEGES ON web.* TO 'laravel'@'localhost';

-- Olvasási jog a game DB-kre (ranking, online players, stb.)
GRANT SELECT ON account.* TO 'laravel'@'localhost';
GRANT SELECT ON common.*  TO 'laravel'@'localhost';
GRANT SELECT ON log.*     TO 'laravel'@'localhost';
GRANT SELECT ON player.*  TO 'laravel'@'localhost';

FLUSH PRIVILEGES;
EXIT;
```

## 4. Projekt feltöltése

```bash
sudo mkdir -p /var/www/metinweb
sudo chown $USER:$USER /var/www/metinweb
git clone https://github.com/te/repo.git /var/www/metinweb
```

## 5. Backend (Laravel) beállítása

```bash
cd /var/www/metinweb/backend
composer install --no-dev --optimize-autoloader
cp .env.example .env
```

**`.env` szerkesztése:**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=http://SZERVER_IP:8000

# Laravel saját adatbázisa
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=web
DB_USERNAME=laravel
DB_PASSWORD=eros_jelszo

# Metin2 game adatbázisok
DB_ACCOUNT_DATABASE=account
DB_COMMON_DATABASE=common
DB_LOG_DATABASE=log
DB_PLAYER_DATABASE=player
```

**`config/database.php`** — több connection hozzáadása:
```php
'connections' => [

    'mysql' => [                          // Laravel saját DB-je (web)
        'driver'   => 'mysql',
        'host'     => env('DB_HOST', '127.0.0.1'),
        'port'     => env('DB_PORT', '3306'),
        'database' => env('DB_DATABASE', 'web'),
        'username' => env('DB_USERNAME', 'laravel'),
        'password' => env('DB_PASSWORD', ''),
        'charset'  => 'utf8mb4',
        'collation'=> 'utf8mb4_unicode_ci',
    ],

    'account' => [
        'driver'   => 'mysql',
        'host'     => env('DB_HOST', '127.0.0.1'),
        'port'     => env('DB_PORT', '3306'),
        'database' => env('DB_ACCOUNT_DATABASE', 'account'),
        'username' => env('DB_USERNAME', 'laravel'),
        'password' => env('DB_PASSWORD', ''),
        'charset'  => 'utf8mb4',
        'collation'=> 'utf8mb4_unicode_ci',
    ],

    'common' => [
        'driver'   => 'mysql',
        'host'     => env('DB_HOST', '127.0.0.1'),
        'port'     => env('DB_PORT', '3306'),
        'database' => env('DB_COMMON_DATABASE', 'common'),
        'username' => env('DB_USERNAME', 'laravel'),
        'password' => env('DB_PASSWORD', ''),
        'charset'  => 'utf8mb4',
        'collation'=> 'utf8mb4_unicode_ci',
    ],

    'log' => [
        'driver'   => 'mysql',
        'host'     => env('DB_HOST', '127.0.0.1'),
        'port'     => env('DB_PORT', '3306'),
        'database' => env('DB_LOG_DATABASE', 'log'),
        'username' => env('DB_USERNAME', 'laravel'),
        'password' => env('DB_PASSWORD', ''),
        'charset'  => 'utf8mb4',
        'collation'=> 'utf8mb4_unicode_ci',
    ],

    'player' => [
        'driver'   => 'mysql',
        'host'     => env('DB_HOST', '127.0.0.1'),
        'port'     => env('DB_PORT', '3306'),
        'database' => env('DB_PLAYER_DATABASE', 'player'),
        'username' => env('DB_USERNAME', 'laravel'),
        'password' => env('DB_PASSWORD', ''),
        'charset'  => 'utf8mb4',
        'collation'=> 'utf8mb4_unicode_ci',
    ],

],
```

Modelleknél a connection megadása:
```php
// Pl. ranking lekérdezéshez
class Player extends Model {
    protected $connection = 'player';
    protected $table = 'player';
}

class Account extends Model {
    protected $connection = 'account';
    protected $table = 'account';
}
```

```bash
php artisan key:generate
php artisan migrate --force
php artisan storage:link
```

**Filament magyar fordítások publikálása:**
```bash
php artisan vendor:publish --tag=filament-panels-translations
php artisan vendor:publish --tag=filament-forms-translations
php artisan vendor:publish --tag=filament-tables-translations
php artisan vendor:publish --tag=filament-actions-translations
php artisan vendor:publish --tag=filament-notifications-translations
php artisan vendor:publish --tag=filament-infolists-translations
php artisan vendor:publish --tag=filament-support-translations
```

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**Jogosultságok:**
```bash
sudo chown -R www:www /var/www/metinweb/backend
sudo chmod -R 775 /var/www/metinweb/backend/storage
sudo chmod -R 775 /var/www/metinweb/backend/bootstrap/cache
```

## 6. Frontend (Next.js) beállítása

> **Fontos:** A `@swc/core`-nak nincs FreeBSD bináris csomagja, ezért a build
> a fejlesztői gépen (Windows/Linux/Mac) történik. A szerver csak a kész outputot futtatja.

**Fejlesztői gépen (Windows):**
```powershell
cd "d:\Metin2 projekt\metinweb\frontend"
npm run build
```

**`.env.local` létrehozása a fejlesztői gépen build előtt:**
```env
NEXT_PUBLIC_API_URL=http://SZERVER_IP:8000
```

**Feltöltés a szerverre:**
```powershell
scp -r .next root@SZERVER_IP:/var/www/metinweb/frontend/
scp -r public root@SZERVER_IP:/var/www/metinweb/frontend/
scp package.json root@SZERVER_IP:/var/www/metinweb/frontend/
```

**Szerveren — csak prod dependencies és indítás:**
```bash
cd /var/www/metinweb/frontend
npm install --omit=dev
```

## 7. Apache konfig

Apache FreeBSD-n: `/usr/local/etc/apache24/`

**Backend** — `/usr/local/etc/apache24/Includes/kesey-backend.conf`:
```apache
Listen 8000

<VirtualHost *:8000>
    DocumentRoot /var/www/metinweb/backend/public

    <Directory /var/www/metinweb/backend/public>
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

## 9. PM2 indítás és automatikus újraindítás reboot után

```bash
pm2 start npm --name "kesey-frontend" -- start
pm2 save
pm2 startup
# A kiírt parancsot másold be és futtasd le
```

---

## Frissítés (deploy)

```bash
cd /var/www/metinweb
git pull

# Backend
cd backend
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Frontend — build a fejlesztői gépen, majd feltöltés
# (Windows fejlesztői gépen):
#   npm run build
#   scp -r .next public package.json root@SZERVER_IP:/var/www/metinweb/frontend/
# Szerveren:
pm2 restart kesey-frontend
```

---

## Domain alapú production setup

Ha van domain, a port-alapú hozzáférés helyett subdomaineket használj:

| Subdomain | Szolgáltatás |
|---|---|
| `domain.hu` | Frontend (Next.js) |
| `api.domain.hu` | Laravel API |
| `admin.domain.hu` | Filament admin panel |

### 1. Apache konfig lecserélése

Töröld a régi port-alapú konfigt és hozz létre újakat:

```bash
rm /usr/local/etc/apache24/Includes/kesey-backend.conf
```

**`/usr/local/etc/apache24/Includes/kesey-api.conf`** (Laravel API):
```apache
<VirtualHost *:80>
    ServerName api.domain.hu
    DocumentRoot /var/www/metinweb/backend/public

    <Directory /var/www/metinweb/backend/public>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog /var/log/kesey-api-error.log
    CustomLog /var/log/kesey-api-access.log combined
</VirtualHost>
```

**`/usr/local/etc/apache24/Includes/kesey-admin.conf`** (Filament admin):
```apache
<VirtualHost *:80>
    ServerName admin.domain.hu
    DocumentRoot /var/www/metinweb/backend/public

    <Directory /var/www/metinweb/backend/public>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog /var/log/kesey-admin-error.log
    CustomLog /var/log/kesey-admin-access.log combined
</VirtualHost>
```

**`/usr/local/etc/apache24/Includes/kesey-frontend.conf`** (Next.js proxy):
```apache
LoadModule proxy_module libexec/apache24/mod_proxy.so
LoadModule proxy_http_module libexec/apache24/mod_proxy_http.so

<VirtualHost *:80>
    ServerName domain.hu
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    ErrorLog /var/log/kesey-frontend-error.log
    CustomLog /var/log/kesey-frontend-access.log combined
</VirtualHost>
```

```bash
service apache24 restart
```

### 2. HTTPS beállítása (Let's Encrypt)

```bash
pkg install -y py311-certbot py311-certbot-apache
certbot --apache -d domain.hu -d api.domain.hu -d admin.domain.hu
```

A Certbot automatikusan átírja az Apache konfigokat HTTPS-re és beállít auto-megújítást.

### 3. .env frissítése a backenden

```env
APP_URL=https://api.domain.hu
FRONTEND_URL=https://domain.hu
```

```bash
php artisan config:cache
```

### 4. Frontend .env.local frissítése (fejlesztői gépen)

```env
NEXT_PUBLIC_API_URL=https://api.domain.hu
```

Majd újra build + feltöltés.

### 5. Tűzfal frissítése

Domain esetén csak 80 és 443 kell, a portok bezárhatók:

```
pass in proto tcp to port { 22, 80, 443 }
```

```bash
pfctl -f /etc/pf.conf
```

---

## Szkriptek

| Fájl | Leírás |
|---|---|
| `start-backend.sh` | MySQL + Apache indítása, Laravel cache rebuild |
| `start-frontend.sh` | Next.js build + PM2 indítás/újraindítás |

A szkripteket másold a szerverre (pl. `/root/` vagy `/var/www/metinweb/`), majd:
```bash
chmod +x start-backend.sh start-frontend.sh
```
