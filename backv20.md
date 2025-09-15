# Инструкция по установке Strapi на чистую Ubuntu 22.04 (для 1GB RAM)

Этот гайд представляет собой единый, отказоустойчивый скрипт для полной автоматической установки Strapi **на свежеустановленную систему**. Он включает в себя обновление системы и, что самое важное, **автоматическое создание временного swap-файла для предотвращения зависания на серверах с малым объемом ОЗУ.**

## Полный скрипт автоматической установки

> **Внимание:** Этот скрипт предназначен для запуска на чистой, только что установленной Ubuntu 22.04.

Просто скопируйте весь блок кода ниже и вставьте его в терминал вашего сервера. Скрипт сам сделает все необходимое.

```bash
#!/bin/bash
set -e

# --- ШАГ 0: ОБНОВЛЕНИЕ СИСТЕМЫ ---
echo "--- Шаг 0: Обновление пакетов системы ---"
sudo apt-get update && sudo apt-get upgrade -y
echo "Обновление системы завершено."


# --- НАСТРАИВАЕМЫЕ ПЕРЕМЕННЫЕ ---
APP_PATH="/var/www/gang-strapi"
NODE_VERSION="18" # Strapi рекомендует Node.js v18 или v20

# IP-адрес вашего сервера. Скрипт определит его автоматически.
IP_ADDRESS=$(curl -s --max-time 10 ifconfig.me || curl -s --max-time 10 api.ipify.org)
DOMAIN_URL="http://api-${IP_ADDRESS}.nip.io"


# --- ШАГ 1: СОЗДАНИЕ SWAP-ФАЙЛА ДЛЯ СТАБИЛЬНОЙ УСТАНОВКИ ---
echo "--- Шаг 1: Создание временного Swap-файла на 2GB ---"
if [ -f /swapfile ]; then
    echo "Swap-файл уже существует."
else
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
fi
free -h # Показываем результат
echo "Swap-файл создан и активирован."


# --- ШАГ 2: УСТАНОВКА NODE.JS И ЗАВИСИМОСТЕЙ ---
echo "--- Шаг 2: Установка Node.js v${NODE_VERSION} ---"
sudo apt-get update
sudo apt-get install -y build-essential curl
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
sudo apt-get install -y nodejs
# Устанавливаем PM2 - менеджер процессов для Node.js
sudo npm install pm2 -g
echo "Установка Node.js и PM2 завершена."


# --- ШАГ 3: УСТАНОВКА И НАСТРОЙКА STRAPI ---
echo "--- Шаг 3: Установка Strapi (может занять 5-15 минут) ---"
sudo mkdir -p ${APP_PATH}
# Даем права текущему пользователю, чтобы создать проект
sudo chown -R $USER:$USER ${APP_PATH}

# Создаем новый проект Strapi. Quickstart использует SQLite по умолчанию - идеально для легкого старта.
npx create-strapi-app@latest ${APP_PATH} --quickstart --no-run

echo "Настройка переменных окружения для Strapi..."
# Создаем .env файл для продакшн-сборки
tee ${APP_PATH}/.env > /dev/null <<EOF
HOST=0.0.0.0
PORT=1337
APP_KEYS=$(openssl rand -base64 64 | head -c 64),$(openssl rand -base64 64 | head -c 64)
API_TOKEN_SALT=$(openssl rand -base64 64 | head -c 64)
ADMIN_JWT_SECRET=$(openssl rand -base64 64 | head -c 64)
JWT_SECRET=$(openssl rand -base64 64 | head -c 64)
EOF

echo "Сборка Strapi для продакшена..."
cd ${APP_PATH}
NODE_ENV=production node --max-old-space-size=2048 ./node_modules/.bin/strapi build

# Меняем владельца обратно на www-data для безопасности
sudo chown -R www-data:www-data ${APP_PATH}
echo "Установка Strapi завершена."


# --- ШАГ 4: ЗАПУСК STRAPI ЧЕРЕЗ PM2 ---
echo "--- Шаг 4: Запуск Strapi через PM2 ---"
# Создаем экосистемный файл для PM2
tee ${APP_PATH}/ecosystem.config.js > /dev/null <<'EOF'
module.exports = {
  apps: [
    {
      name: 'gang-strapi',
      cwd: __dirname,
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
EOF
sudo chown www-data:www-data ${APP_PATH}/ecosystem.config.js

# Запускаем приложение от имени www-data
# Старый метод, который вызывал ошибку прав доступа
# sudo -u www-data pm2 start ${APP_PATH}/ecosystem.config.js

# Новый, более надежный метод:
# Запускаем PM2 от текущего пользователя (root), но указываем,
# что сам дочерний процесс Strapi должен работать под пользователем www-data.
pm2 start ${APP_PATH}/ecosystem.config.js --user www-data

# Создаем и запускаем сервис автозапуска PM2
# PM2 сам сгенерирует и покажет команду `sudo env ...`, которую нужно выполнить.
# Мы выполняем ее здесь автоматически.
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $(whoami) --hp /home/$(whoami)
sudo pm2 save --force
echo "Strapi запущен через PM2."


# --- ШАГ 5: УСТАНОВКА И НАСТРОЙКА NGINX КАК REVERSE PROXY ---
echo "--- Шаг 5: Настройка Nginx ---"
sudo apt-get install -y nginx

sudo tee /etc/nginx/sites-available/gang-strapi > /dev/null <<EOF
server {
    listen 80;
    server_name ${IP_ADDRESS} api-${IP_ADDRESS}.nip.io;

    location / {
        proxy_pass http://127.0.0.1:1337;
        proxy_http_version 1.1;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_set_header X-Forwarded-Server \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Host \$host;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_pass_request_headers on;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/gang-strapi /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
echo "Настройка Nginx завершена."


# --- ШАГ 6: ОЧИСТКА SWAP-ФАЙЛА ---
echo "--- Шаг 6: Отключаем и удаляем временный Swap-файл ---"
sudo swapoff /swapfile
sudo rm /swapfile
echo "Очистка Swap-файла завершена."


# --- ЗАВЕРШЕНИЕ ---
echo -e "\n\n--- УСТАНОВКА STRAPI ЗАВЕРШЕНА! ---"
echo "URL для входа в админ-панель: ${DOMAIN_URL}/admin"
echo "URL для API запросов (для Vercel): ${DOMAIN_URL}"
echo "-----------------------------------"
echo "Следующие шаги:"
echo "1. Зайдите в админ-панель по URL выше и создайте своего первого администратора."
echo "2. Перейдите в 'Content-Type Builder' и создайте ваши коллекции:"
echo "   - 'Product' (name, slug, price, description, image)"
echo "   - 'Order' (line_items (JSON), customer_details (JSON), status)"
echo "3. Перейдите в 'Settings -> Users & Permissions Plugin -> Roles -> Public' и разрешите 'find' и 'findOne' для Products."
echo "4. Перейдите в 'Settings -> API Tokens' и создайте 'Full access' токен. Скопируйте его."
echo "5. Пропишите STRAPI_API_URL=${DOMAIN_URL} и STRAPI_API_TOKEN в переменных окружения на Vercel."
echo "6. Сделайте Redeploy на Vercel."
