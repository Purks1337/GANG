This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Backend: WordPress + WooCommerce (LEMP, без Docker)

Цель: лёгкий стек без контейнеров на VPS (Ubuntu 22.04), WordPress + WooCommerce + MariaDB, Nginx + PHP-FPM.

### 1) Установка LEMP на VPS

```bash
# Обновления
sudo apt update && sudo apt -y upgrade

# Nginx
sudo apt -y install nginx

# MariaDB
sudo apt -y install mariadb-server mariadb-client
sudo mysql_secure_installation
# Создать БД и пользователя
sudo mysql <<'SQL'
CREATE DATABASE wordpress CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'wp'@'localhost' IDENTIFIED BY 'wp-strong-pass';
GRANT ALL PRIVILEGES ON wordpress.* TO 'wp'@'localhost';
FLUSH PRIVILEGES;
SQL

# PHP-FPM + расширения
sudo apt -y install php-fpm php-mysql php-xml php-gd php-curl php-zip php-mbstring
```

### 2) Установка WordPress

```bash
cd /var/www
sudo mkdir -p gang-wp && sudo chown -R $USER:$USER gang-wp
cd gang-wp
curl -O https://wordpress.org/latest.tar.gz
tar xzf latest.tar.gz --strip-components=1
rm latest.tar.gz
cp wp-config-sample.php wp-config.php
sed -i "s/database_name_here/wordpress/" wp-config.php
sed -i "s/username_here/wp/" wp-config.php
sed -i "s/password_here/wp-strong-pass/" wp-config.php
# Сгенерируйте SALT-ключи: https://api.wordpress.org/secret-key/1.1/salt/
```

### 3) Nginx виртуальный хост

```bash
sudo tee /etc/nginx/sites-available/gang-wp >/dev/null <<'EOF'
server {
  listen 80;
  server_name api.gang-ground.ru;
  root /var/www/gang-wp;
  index index.php index.html;

  location / {
    try_files $uri $uri/ /index.php?$args;
  }

  location ~ \.php$ {
    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:/var/run/php/php-fpm.sock; # проверьте сокет версии PHP
  }

  location ~* \.(jpg|jpeg|png|gif|svg|css|js|ico|webp)$ {
    expires 30d;
    access_log off;
  }
}
EOF
sudo ln -s /etc/nginx/sites-available/gang-wp /etc/nginx/sites-enabled/gang-wp
sudo nginx -t && sudo systemctl reload nginx
```

Для SSL добавьте certbot позже:
```bash
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot --nginx -d api.gang-ground.ru --redirect -n --agree-tos -m you@mail.com
```

### 4) Первая настройка WordPress
- Откройте `http://api.gang-ground.ru` и завершите установку
- Настройки → Постоянные ссылки → «Название записи» `/%postname%`
- Плагины: WooCommerce (обязательно). REST API встроен в Woo.

### 5) WooCommerce REST API ключ
- WooCommerce → Настройки → Продвинутые → REST API → Создать ключ (Чтение/Запись)
- Сохраните Consumer Key/Secret

### 6) Переменные окружения фронтенда
Добавьте в переменные окружения проекта:

```bash
# Базовый URL WordPress (без слеша на конце)
WOO_BASE_URL=https://api.gang-ground.ru
# Ключи WooCommerce REST API
WOO_CONSUMER_KEY=ck_...
WOO_CONSUMER_SECRET=cs_...
```

Примечание: если используете `next/image` с медиа WordPress, домен из `WOO_BASE_URL` будет автоматически разрешён (см. `next.config.js`).

### 7) Как это работает
- `src/lib/woo.ts`: тонкий клиент Woo REST (`wooGet`, `wooPost`)
- API-роуты:
  - `GET /api/products` → Woo `/wc/v3/products`
  - `GET /api/products/[slug]` → поиск по `slug`, вариации `/variations`
  - `POST /api/checkout` → валидация остатков + создание заказа `/orders`

---

## Локальная разработка
- Заполните `.env.local` указанными переменными (`WOO_*`)
- Запустите `npm run dev`
- По умолчанию поддержаны картинки с `localhost:8080` и домена из `WOO_BASE_URL`
