# Инструкция по установке Strapi на Ubuntu 22.04

Этот гайд представляет собой единый скрипт для полной автоматической установки Strapi с нуля. Он включает в себя полную очистку от предыдущей LEMP-установки.

## Полный скрипт автоматической установки

> **Внимание:** Этот скрипт удалит Nginx, MariaDB, PHP и связанные с ними файлы. Выполняйте его только на чистом сервере или если вы готовы к полной переустановке бэкенда.

Просто скопируйте весь блок кода ниже и вставьте его в терминал вашего сервера. Скрипт сам задаст все необходимые переменные и выполнит все шаги.

```bash
#!/bin/bash
set -e

# --- НАСТРАИВАЕМЫЕ ПЕРЕМЕННЫЕ ---
APP_NAME="gang-strapi"
APP_PATH="/var/www/gang-strapi"
NODE_VERSION="18" # Strapi рекомендует Node.js v18 или v20

# IP-адрес вашего сервера. Скрипт определит его автоматически.
IP_ADDRESS=$(curl -s ifconfig.me)
API_URL="http://${IP_ADDRESS}:1337"
DOMAIN_URL="http://api-${IP_ADDRESS}.nip.io"


# --- ШАГ 0: ПОЛНАЯ ОЧИСТКА ОТ LEMP СТЕКА ---
echo "--- Шаг 0: Полная очистка от LEMP ---"
sudo systemctl stop nginx || true
sudo apt-get purge -y nginx nginx-common
sudo apt-get purge -y mariadb-server mariadb-client
sudo apt-get purge -y php.*
sudo apt-get autoremove -y
sudo rm -rf /var/www/gang-wp
sudo rm -f /etc/nginx/sites-available/gang-wp /etc/nginx/sites-enabled/gang-wp
echo "Очистка завершена."


# --- ШАГ 1: УСТАНОВКА NODE.JS И ЗАВИСИМОСТЕЙ ---
echo "--- Шаг 1: Установка Node.js v${NODE_VERSION} ---"
sudo apt-get update
sudo apt-get install -y build-essential curl
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
sudo apt-get install -y nodejs
# Устанавливаем PM2 - менеджер процессов для Node.js
sudo npm install pm2 -g
echo "Установка Node.js завершена."


# --- ШАГ 2: УСТАНОВКА И НАСТРОЙКА STRAPI ---
echo "--- Шаг 2: Установка Strapi ---"
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
APP_KEYS=$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32)
API_TOKEN_SALT=$(openssl rand -base64 32)
ADMIN_JWT_SECRET=$(openssl rand -base64 32)
TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=./.tmp/data.db
EOF

echo "Сборка Strapi для продакшена..."
cd ${APP_PATH}
NODE_ENV=production npm run build

# Меняем владельца обратно на www-data для безопасности
sudo chown -R www-data:www-data ${APP_PATH}
echo "Установка Strapi завершена."


# --- ШАГ 3: ЗАПУСК STRAPI ЧЕРЕЗ PM2 ---
echo "--- Шаг 3: Запуск Strapi через PM2 ---"
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

# Запускаем приложение от имени www-data
sudo -u www-data pm2 start ${APP_PATH}/ecosystem.config.js
# Сохраняем конфигурацию PM2 для автозапуска после перезагрузки сервера
sudo pm2 startup systemd -u www-data --hp /home/$USER
sudo pm2 save
echo "Strapi запущен через PM2."


# --- ШАГ 4: УСТАНОВКА И НАСТРОЙКА NGINX КАК REVERSE PROXY ---
echo "--- Шаг 4: Настройка Nginx ---"
sudo apt-get install -y nginx

sudo tee /etc/nginx/sites-available/gang-strapi > /dev/null <<EOF
server {
    listen 80;
    server_name api-${IP_ADDRESS}.nip.io;

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


# --- ЗАВЕРШЕНИЕ ---
echo -e "\n\n--- УСТАНОВКА STRAPI ЗАВЕРШЕНА! ---"
echo "URL для входа в админ-панель: ${DOMAIN_URL}/admin"
echo "URL для API запросов: ${DOMAIN_URL}"
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
```

## Как использовать скрипт

1.  Скопируйте **весь** блок кода выше (начиная с `#!/bin/bash` и до самого конца).
2.  Вставьте его в терминал вашего сервера и нажмите Enter.
3.  Скрипт выполнит все шаги автоматически. В конце он выведет URL для входа в админ-панель.

После этого у вас будет полностью рабочая установка Strapi, готовая к интеграции с вашим Next.js фронтендом.
