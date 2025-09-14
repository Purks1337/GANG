# Полное руководство: Установка WordPress + LEMP на 1GB RAM сервере (Ubuntu 22.04)

Это чистовая инструкция для установки с нуля. Она включает очистку от старых попыток, оптимизацию под малое количество ОЗУ и шаги для избежания проблем со входом. Выполняйте команды по порядку.

---

### Шаг 0: Полная очистка от предыдущей установки

**Внимание! Эти команды удалят старую базу данных и файлы WordPress.**

```bash
# Останавливаем службы
sudo systemctl stop nginx
sudo systemctl stop php*-fpm

# Удаляем базу данных и пользователя
sudo mariadb -e "DROP DATABASE IF EXISTS wordpress; DROP USER IF EXISTS 'wp'@'localhost';"

# Удаляем старые файлы WordPress
sudo rm -rf /var/www/gang-wp

# Удаляем конфиг Nginx
sudo rm -f /etc/nginx/sites-available/gang-wp
sudo rm -f /etc/nginx/sites-enabled/gang-wp

# Удаляем конфиги оптимизации
sudo rm -f /etc/mysql/mariadb.conf.d/60-gang-tuning.cnf

# Перезапускаем Nginx, чтобы он поднялся со стандартным конфигом
sudo systemctl start nginx
```

---

### Шаг 1: Подготовка и установка LEMP

```bash
# Обновляем систему и ставим всё необходимое одной командой
sudo apt update && sudo apt -y upgrade
sudo apt -y install nginx mariadb-server mariadb-client php-fpm php-mysql php-xml php-gd php-curl php-zip php-mbstring curl unzip

# Включаем службы
# Находим и включаем правильную версию PHP-FPM
PHP_FPM_SERVICE=$(find /lib/systemd/system -name "php*-fpm.service" | sed 's@.*/@@')
sudo systemctl enable --now nginx mariadb "$PHP_FPM_SERVICE"
```

---

### Шаг 2: Настройка MariaDB (с оптимизацией)

```bash
# 1. Запускаем скрипт базовой безопасности (отвечайте на вопросы)
sudo mysql_secure_installation

# 2. Создаем базу данных и пользователя одной командой
sudo mariadb -e "CREATE DATABASE wordpress CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE USER 'wp'@'localhost' IDENTIFIED BY 'wp-strong-pass'; GRANT ALL PRIVILEGES ON wordpress.* TO 'wp'@'localhost'; FLUSH PRIVILEGES;"

# 3. Оптимизируем MariaDB для 1 ГБ RAM
printf '%s\n' '[mysqld]' 'innodb_buffer_pool_size = 256M' 'innodb_log_file_size = 64M' 'max_connections = 50' 'table_open_cache = 400' 'thread_cache_size = 8' | sudo tee /etc/mysql/mariadb.conf.d/60-gang-tuning.cnf >/dev/null

# 4. Перезапускаем MariaDB для применения настроек
sudo systemctl restart mariadb
```

---

### Шаг 3: Настройка PHP-FPM (с оптимизацией)

```bash
# Находим путь к php.ini и меняем лимиты памяти
INI_PATH=$(sudo find /etc/php -name "php.ini" -and -path "*/fpm/*" | head -n 1)
sudo sed -i "s/^memory_limit = .*/memory_limit = 256M/" "$INI_PATH"
sudo sed -i "s/^upload_max_filesize = .*/upload_max_filesize = 32M/" "$INI_PATH"
sudo sed -i "s/^post_max_size = .*/post_max_size = 32M/" "$INI_PATH"

# Перезапускаем PHP-FPM
sudo systemctl restart php*-fpm
```

---

### Шаг 4: Установка WordPress (автоматизированная)

```bash
# 1. Создаем директорию и переходим в нее
sudo mkdir -p /var/www/gang-wp
cd /var/www/gang-wp

# 2. Скачиваем, распаковываем и очищаем
curl -O https://wordpress.org/latest.tar.gz
sudo tar xzf latest.tar.gz --strip-components=1
sudo rm latest.tar.gz

# 3. Создаем и настраиваем wp-config.php
sudo cp wp-config-sample.php wp-config.php
sudo sed -i "s/database_name_here/wordpress/" wp-config.php
sudo sed -i "s/username_here/wp/" wp-config.php
sudo sed -i "s/password_here/wp-strong-pass/" wp-config.php

# 4. Генерируем и вставляем свежие SALT-ключи
sudo sed -i "/AUTH_KEY/d;/SECURE_AUTH_KEY/d;/LOGGED_IN_KEY/d;/NONCE_KEY/d;/AUTH_SALT/d;/SECURE_AUTH_SALT/d;/LOGGED_IN_SALT/d;/NONCE_SALT/d" wp-config.php
curl -s https://api.wordpress.org/secret-key/1.1/salt/ | sudo tee -a wp-config.php >/dev/null
```

---

### Шаг 5: Настройка Nginx

Мы будем использовать домен `nip.io`, чтобы избежать проблем с куки при работе по IP. **Замените `ВАШ.IP.АДРЕС.СЮДА` на IP вашего сервера (точки вместо дефисов).** Например, для IP `31.130.144.157` домен будет `api-31-130-144-157.nip.io`.

```bash
# --- ЗАМЕНИТЕ IP АДРЕС ВНУТРИ КАВЫЧЕК ---
SERVER_IP="31.130.144.157"
# --- БОЛЬШЕ НИЧЕГО НЕ ТРОГАЙТЕ ---

HOST_NAME="api-$(echo $SERVER_IP | tr '.' '-').nip.io"
PHP_SOCK=$(find /var/run/php -name "php*-fpm.sock" | head -n 1)

# Создаем конфиг Nginx
sudo tee /etc/nginx/sites-available/gang-wp >/dev/null <<EOF
server {
  listen 80;
  server_name $HOST_NAME;
  root /var/www/gang-wp;
  index index.php index.html;

  location / {
    try_files \$uri \$uri/ /index.php?\$args;
  }

  location ~ \\.php\$ {
    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:$PHP_SOCK;
    fastcgi_buffers 16 16k;
    fastcgi_buffer_size 32k;
  }

  location ~* \\.(jpg|jpeg|png|gif|svg|css|js|ico|webp)\$ {
    expires 30d;
    access_log off;
  }
}
EOF

# Включаем наш сайт и отключаем дефолтный
sudo ln -s /etc/nginx/sites-available/gang-wp /etc/nginx/sites-enabled/gang-wp
sudo rm -f /etc/nginx/sites-enabled/default

# Проверяем и перезапускаем Nginx
sudo nginx -t && sudo systemctl reload nginx
```

---

### Шаг 6: Установка прав доступа

Это критически важный шаг.
```bash
sudo chown -R www-data:www-data /var/www/gang-wp
sudo find /var/www/gang-wp -type d -exec chmod 755 {} \;
sudo find /var/www/gang-wp -type f -exec chmod 644 {} \;
```

---

### Шаг 7: Первый запуск WordPress

1.  Откройте в браузере `http://api-ВАШ-IP-АДРЕС.nip.io` (например, `http://api-31-130-144-157.nip.io`).
2.  Пройдите стандартную установку: выберите язык, создайте пользователя-администратора. **Вы должны сразу попасть в админку.**
3.  В админ-панели перейдите в **Настройки → Постоянные ссылки** и выберите **«Название записи»**. Нажмите «Сохранить изменения».

### Шаг 8: Настройка WooCommerce и Vercel

1.  **В админке WordPress:** Установите и активируйте плагин **WooCommerce**. Пройдите базовую настройку.
2.  **Создайте API-ключи:** WooCommerce → Настройки → Продвинутые → REST API → Создать ключ (права: Чтение/Запись). Сохраните `Consumer Key` и `Consumer Secret`.
3.  **В проекте на Vercel:** Перейдите в Settings → Environment Variables и установите:
    *   `WOO_BASE_URL`: `http://api-ВАШ-IP-АДРЕС.nip.io`
    *   `WOO_CONSUMER_KEY`: `ck_...` (ваш ключ)
    *   `WOO_CONSUMER_SECRET`: `cs_...` (ваш секрет)
4.  **Сделайте Redeploy** вашего проекта на Vercel.

Теперь всё должно работать. Если после этого снова возникнет проблема со входом, значит, дело не в сервере, а в чем-то на стороне вашего браузера или сети (кеш, расширения, VPN).