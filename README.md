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

## WordPress (Backend) - Local via Docker

Stack is defined in `docker-compose.yml` and includes MySQL, WordPress, and phpMyAdmin.

Commands:

```bash
# Start containers
npm run wp:up

# Stop containers
npm run wp:down

# Tail logs
npm run wp:logs
```

Services:
- WordPress: http://localhost:8080
- phpMyAdmin: http://localhost:8081

Default MySQL credentials (override with env):
- DB: wordpress
- User: wp
- Password: wp
- Root password: root

---

## Safe Backend Deploy on VPS (Timeweb Cloud/Ubuntu + Docker)

Follow this to avoid downtime and data loss when deploying WordPress + MySQL with Docker on a VPS.

### 1) Server preparation
```bash
sudo apt update && sudo apt -y upgrade
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER && newgrp docker
docker --version && docker compose version
```

### 2) Project directory and files
```bash
sudo mkdir -p /opt/gang-backend && sudo chown -R $USER:$USER /opt/gang-backend
cd /opt/gang-backend
```
Create `.env`:
```bash
MYSQL_DATABASE=wordpress
MYSQL_USER=wp
MYSQL_PASSWORD=wp-strong-pass
MYSQL_ROOT_PASSWORD=root-strong-pass
```
Ensure `docker-compose.yml` binds to localhost only (keeps ports private):
```yaml
# ports:
#   - "127.0.0.1:8080:80"  # wordpress
#   - "127.0.0.1:8081:80"  # phpmyadmin
```

### 3) Safe bring-up (step-by-step)
```bash
cd /opt/gang-backend
# Step 1: DB only
docker compose up -d db && docker compose logs -f db
# Step 2: WordPress when DB is healthy
docker compose up -d wordpress && docker compose logs -f wordpress
# (Optional) phpMyAdmin
docker compose up -d phpmyadmin
```
Quick check:
```bash
curl -I http://127.0.0.1:8080
```

### 4) Nginx reverse proxy (public 80/443)
```bash
sudo apt -y install nginx
sudo tee /etc/nginx/sites-available/gang-backend >/dev/null <<'EOF'
server {
  listen 80;
  server_name api.gang-ground.ru;
  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_read_timeout 300;
  }
}
EOF
sudo ln -s /etc/nginx/sites-available/gang-backend /etc/nginx/sites-enabled/gang-backend
sudo nginx -t && sudo systemctl reload nginx
```
Add SSL later when stable:
```bash
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot --nginx -d api.gang-ground.ru --redirect -n --agree-tos -m you@mail.com
```

### 5) WordPress first run (one-time)
- Open http://SERVER_IP:8080 (temporarily) or https://api.gang-ground.ru (after Nginx/SSL).
- Complete WP installer.
- Settings → Permalinks → “Post name” `/%postname%` → Save.
- Plugins: WooCommerce, WPGraphQL, WPGraphQL for WooCommerce (from GitHub releases).
- Check GraphQL at `/graphql` (or `/?graphql`).

### 6) Frontend env (Vercel)
Set in Vercel Project Settings → Environment Variables:
```bash
NEXT_PUBLIC_WP_GRAPHQL_ENDPOINT=https://api.gang-ground.ru/graphql
```
Redeploy the project.

### 7) Stabilization checklist
- Always work from the same directory `/opt/gang-backend`.
- Do NOT use `docker compose down -v` (this deletes volumes/data). Use `docker compose down`.
- Step up containers gradually (DB → WP → phpMyAdmin → Nginx).
- Keep WordPress ports bound to localhost (`127.0.0.1:8080`), expose only 80/443 via Nginx.
- Verify resources before changes: `free -h`, `df -h`.
- Monitor: `docker compose ps`, `docker logs <container>`, `systemctl status nginx`.
- Backups: snapshot Docker volumes (`db_data`, `wp_data`) before major changes.

### 8) Troubleshooting quickies
- Nginx error: `nginx -t` then `systemctl reload nginx`.
- WP setup reappears: verify you didn’t delete volumes; confirm you’re in the same compose directory.
- 404 on `/graphql`: re-save Permalinks and ensure WPGraphQL is active.
- High load: start services one by one; consider upgrading VPS or limiting heavy plugins.
