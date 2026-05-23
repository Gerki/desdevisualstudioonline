# visualgv.com — Project Setup & Deployment Guide

## 📋 Project Status: MVP Ready

The visualgv.com SaaS platform MVP has been created with a complete Next.js application, full backend API, database schema, and deployment infrastructure.

## ✅ What's Included

### Frontend Components ✅
- **Authentication Pages**: Login, Register with email/password and Google OAuth
- **Dashboard**: Home overview with statistics
- **Organizations**: Multi-tenant organization management
- **Files**: Digital asset upload and management  
- **People**: Team member management interface
- **Settings**: User account and preferences settings
- **Landing Page**: Marketing/public homepage
- **UI Components**: shadcn/ui-inspired button, input, card components
- **Responsive Design**: Mobile-friendly sidebar navigation

### Backend API Routes ✅
- `POST /api/auth/register` - User registration
- `GET /api/auth/[...nextauth]` - NextAuth endpoints
- `GET /api/organizations` - List organizations
- `POST /api/organizations` - Create organization
- `GET /api/campaigns` - List campaigns
- `POST /api/campaigns` - Create campaign
- `POST /api/files/upload` - Get presigned S3 URL
- `POST /api/webhooks/stripe` - Stripe webhook handler

### Database Schema ✅
- Users and authentication (accounts, sessions, verification tokens)
- Organizations and multi-tenancy (members, invitations)
- Campaigns and campaigns
- Digital files with authorization workflow
- Physical assets (billboards, buses, screens, etc.)
- Print orders and print workflow
- Installations with GPS evidence tracking
- Chat messages for real-time collaboration
- Audit logs for compliance

### Services & Libraries ✅
- `lib/auth.ts` - NextAuth.js configuration
- `lib/prisma.ts` - Database client (singleton pattern)
- `lib/s3.ts` - AWS S3/DigitalOcean Spaces integration
- `lib/stripe.ts` - Stripe payments integration
- `lib/redis.ts` - Redis caching layer
- `lib/email.ts` - Resend email service
- `lib/validations/` - Zod validation schemas

### Custom Hooks & State ✅
- `useCurrentUser()` - Get current user session
- `useOrganizations()` - Fetch organizations
- `useCreateOrganization()` - Create organization mutation
- `useOrganizationStore` - Zustand global state

### Configuration Files ✅
- `.env.example` - Environment variables template
- `next.config.ts` - Next.js configuration with image optimization
- `package.json` - All dependencies installed
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `docker-compose.yml` - PostgreSQL and Redis services
- `ecosystem.config.js` - PM2 production configuration
- `CLAUDE.md` - AI assistant rules and conventions
- `.github/workflows/deploy.yml` - GitHub Actions CI/CD

## 🚀 Local Development Setup

### 1. Install Dependencies (Already Done ✅)
```bash
npm install
```

### 2. Start Databases
```bash
cd /path/to/app
docker compose up -d
```

This starts:
- PostgreSQL 16 on localhost:5432
- Redis 7 on localhost:6379

### 3. Set Up Environment
```bash
cp .env.example .env.local
# Edit .env.local and fill in:
# - DATABASE_URL (localhost)
# - NEXTAUTH_URL (http://localhost:3000)
# - NEXTAUTH_SECRET (generate a random string)
# - Google OAuth credentials
# - Stripe keys
# - AWS S3 credentials
```

### 4. Initialize Database
```bash
npx prisma migrate dev --name init
```

### 5. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## 🧪 Testing the Application

### Test User Registration
1. Go to http://localhost:3000/register
2. Create account with email and password
3. You'll be automatically signed in

### Test Dashboard
1. Access http://localhost:3000/dashboard
2. Create an organization
3. Explore files, people, settings

### Test API
```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'

# Get organizations
curl http://localhost:3000/api/organizations \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

## 📦 Production Deployment

### Prerequisites
- DigitalOcean VPS (Ubuntu 24.04 LTS)
- Domain configured in DNS (Cloudflare recommended)
- GitHub SSH key for automatic deployment
- Environment variables for production

### Step 1: VPS Setup

```bash
# SSH into VPS
ssh root@your-vps-ip

# Create deploy user
adduser deploy
usermod -aG sudo deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy

# Configure SSH
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
# Set: PasswordAuthentication no
sudo systemctl restart sshd

# Firewall
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw enable

# Switch to deploy user
su - deploy
```

### Step 2: Install Dependencies

```bash
# Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm alias default 20

# Global tools
npm install -g pm2
pm2 install pm2-logrotate

# Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker deploy
newgrp docker

# Nginx & SSL
sudo apt install nginx certbot python3-certbot-nginx -y
```

### Step 3: Clone & Deploy

```bash
mkdir -p /home/deploy/visualgv
cd /home/deploy/visualgv
git clone https://github.com/Gerki/desdevisualstudioonline.git .
cd app

# Set environment
cp .env.example .env.production
# Edit with production credentials
nano .env.production
```

### Step 4: Database & Build

```bash
# Start databases
docker compose up -d

# Run migrations
npx prisma migrate deploy

# Build app
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
```

### Step 5: Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/visualgv
```

See the `visualgv_MVP_Master_Prompt.md` SECTION 4.6 for full Nginx config.

```bash
sudo ln -s /etc/nginx/sites-available/visualgv /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL certificate
sudo certbot --nginx -d visualgv.com -d www.visualgv.com
```

### Step 6: GitHub Actions Setup

Add these secrets to GitHub repository settings:
- `VPS_HOST`: Your VPS IP or domain
- `VPS_SSH_KEY`: Contents of ~/.ssh/id_rsa from deployment user
- `SLACK_WEBHOOK`: (Optional) Slack notification webhook

### Step 7: Verify Deployment

1. Visit https://visualgv.com
2. Test login flow
3. Create organization
4. Upload file

## 🔄 Continuous Deployment

Every push to the `main` branch triggers:
1. **Test**: Lint and build checks
2. **Deploy**: SSH to VPS, pull code, migrate DB, restart app
3. **Notify**: Slack notification on completion

## 📊 Monitoring & Maintenance

### Check Application Status
```bash
pm2 status
pm2 logs visualgv
```

### View Database
```bash
npx prisma studio
```

### Backup Database
```bash
# PostgreSQL backup
docker compose exec postgres pg_dump -U visualgv_user visualgv_production > backup.sql

# Restore
docker compose exec -T postgres psql -U visualgv_user visualgv_production < backup.sql
```

## 🆘 Troubleshooting

### Database Connection Error
```bash
# Check if containers are running
docker compose ps

# Restart containers
docker compose down && docker compose up -d

# Reset database
npx prisma migrate reset
```

### Authentication Issues
- Ensure NEXTAUTH_SECRET is set in .env.local
- Check NextAuth logs: `pm2 logs visualgv`
- Verify Google OAuth credentials are correct

### S3 Upload Errors
- Check AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
- Verify bucket name and region
- Check bucket CORS settings

## 📚 Next Steps

1. **Configure External Services**
   - Google OAuth credentials
   - Stripe API keys
   - AWS S3 or DigitalOcean Spaces
   - Resend email service

2. **Customize Branding**
   - Update logo and colors
   - Customize email templates
   - Update landing page copy

3. **Add Advanced Features**
   - Real-time chat with Pusher
   - SMS notifications with Twilio
   - Background jobs with BullMQ
   - Error tracking with Sentry

4. **Implement Missing Pages**
   - Inventory management
   - Print order workflow
   - Installation tracking
   - GPS evidence management
   - Reports and analytics

5. **Testing & QA**
   - Unit tests with Jest
   - E2E tests with Playwright
   - Load testing
   - Security audit

## 💡 Development Tips

- Always check `CLAUDE.md` for coding standards
- Use TypeScript strictly - no `any` types
- Validate all API inputs with Zod
- Keep API routes under 500 lines
- Use environment variables for configuration
- Test locally before pushing to main
- Review `.github/workflows/deploy.yml` for deployment process

## 🎯 Key Files to Remember

- **Schema**: `prisma/schema.prisma`
- **Auth**: `lib/auth.ts` + `app/api/auth/`
- **API**: `app/api/` routes
- **Components**: `components/` with subdirectories
- **Pages**: `app/(dashboard)/` and `app/(auth)/`
- **Config**: `next.config.ts`, `.env.example`
- **Rules**: `CLAUDE.md` and `visualgv_MVP_Master_Prompt.md`

---

**Project Status**: Ready for production MVP launch with basic CRUD operations for organizations, campaigns, and files. Real-time chat, background jobs, and advanced analytics can be added as Phase 2 features.

**Last Updated**: May 16, 2026
**Created By**: GitHub Copilot for Gerardo Velázquez Carmona
