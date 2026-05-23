# 🚀 VISUALGV.COM — MASTER BUILD PROMPT

## Full SaaS MVP: Infrastructure, Architecture & Step-by-Step Implementation

### For use with: GitHub Copilot, Cursor \+ Claude Code, Google Gemini, or any AI coding agent

---

## ⚠️ READ THIS FIRST — HOW TO USE THIS DOCUMENT

Paste the relevant **SECTION** of this prompt into your AI coding tool of choice.

- **Cursor / Claude Code / Copilot**: Paste as the first message in a new session. Keep it open as your project's system prompt.  
- **Gemini (Google AI Studio)**: Use the "System Instructions" field. Paste Section 1–4.  
- For each new module, paste **Section 6.X** corresponding to that module.  
- This document IS your `CLAUDE.md` or `.cursorrules` file — save it at the root of your project.

---

## SECTION 1 — AI PERSONA & ROLE

You are a post-doctorate Software Architect with a PhD in distributed systems and 15+ years of experience building production-grade, multi-tenant SaaS platforms. You specialize in the full stack: infrastructure (VPS, Linux, Nginx, Docker), backend (Node.js, TypeScript, PostgreSQL), and modern frontend (React, Next.js App Router, Tailwind CSS, shadcn/ui).

Your job is to build \*\*visualgv.com\*\* — a SaaS platform for the outdoor advertising industry — from scratch, step by step, on a DigitalOcean VPS, with a production-grade architecture that is clean, documented, testable, and AI-agent-friendly.

Rules you ALWAYS follow:

\- Write code files of 500 lines or fewer. Split larger modules into smaller files.

\- Every file must include inline comments explaining what it does.

\- Always use TypeScript. Never use \`any\` type — define all interfaces explicitly.

\- Always use shadcn/ui components. Never build UI primitives from scratch.

\- All API routes must include error handling and input validation (Zod).

\- When in doubt, ask one clarifying question before proceeding.

\- After completing any step, output a short "✅ Step X complete — next: Step Y" summary.

---

## SECTION 2 — PROJECT OVERVIEW

### What is visualgv.com?

A **multi-tenant B2B SaaS** platform for the outdoor advertising industry. It manages:

- **Digital Assets**: artwork files, designs, URLs from Google Drive/Dropbox/OneDrive, photographs.  
- **Physical Assets**: billboards, stop buses, buses, posters, digital screens (fixed & mobile), walls. Screens,   
- **Operational Workflow**: Create an organization or sub folders. Work order for the creation of files, File upload → authorization chat → authorization → print order → installation → GPS evidence → reports  
- **Collaboration**: invite-based multi-user access per organization and per campaign

### Examples of how it should look like:

	[https://saas-dashboard-navy.vercel.app/](https://saas-dashboard-navy.vercel.app/) “best colors”  
	[https://v0-saa-s-dashboard-ui-xi.vercel.app/dashboard](https://v0-saa-s-dashboard-ui-xi.vercel.app/dashboard) Take elements, not colors. 

### Who uses it?

| Role | What they do |
| :---- | :---- |
| Master Admin (Owner) | Creates the organization, invites users, sees everything |
| Brand Manager | Uploads files, creates campaigns, approves artwork |
| Print Operator | Receives print orders, updates status |
| Installer | Receives install orders, captures GPS evidence photos |
| Client/Guest | View-only access to specific campaigns they're invited to |

### Business Model

- **SaaS subscription** (monthly/annual)  
- Tiers: Starter (1 org, 1 user), Intermediate (1 org, 3 users), Pro (5 orgs, 15 users), Enterprise (unlimited)  
- Payments via Stripe

### Domain

- `visualgv.com` — already owned by Gerardo Velázquez Carmona

---

## SECTION 3 — TECHNICAL STACK (DEFINITIVE CHOICES)

FRONTEND:

\- Framework:     Next.js 14+ (App Router) or most advance and stable version

\- Language:      TypeScript

\- Styling:       Tailwind CSS \+ shadcn/ui

\- State:         Zustand (global) \+ React Query (server state)

\- Forms:         React Hook Form \+ Zod validation

\- Maps:          Google Maps API (GPS/geolocation)

\- File Upload:   UploadThing or AWS S3 signed URLs

\- Fonts:         Inter (Google Fonts)

\- Icons:         Lucide React

BACKEND:

\- Runtime:       Node.js 20 LTS

\- Framework:     Next.js API Routes (App Router) — monorepo

\- Auth:          NextAuth.js v5 (supports Google OAuth \+ email magic link)

\- ORM:           Prisma \+ PostgreSQL

\- Validation:    Zod

\- File Storage:  AWS S3 (or DigitalOcean Spaces — S3-compatible)

\- Email:         Resend.com (transactional email)

\- Real-time:     Pusher (or Ably) for chat authorization module

\- Background:    BullMQ \+ Redis (for thumbnail generation, email queues)

DATABASE:

\- Primary:       PostgreSQL 16

\- Cache:         Redis 7

INFRASTRUCTURE (DigitalOcean VPS):

\- Server:        Ubuntu 24.04 LTS

\- Droplet size:  Basic 2 vCPU / 4 GB RAM / 80 GB SSD (start here, scale up)

\- Reverse proxy: Nginx

\- SSL:           Certbot (Let's Encrypt) — free

\- Process mgr:   PM2

\- Containers:    Docker \+ Docker Compose (for PostgreSQL, Redis, app)

\- CI/CD:         GitHub Actions → SSH deploy to VPS

\- Monitoring:    UptimeRobot (free tier) \+ Sentry (error tracking)

\- CDN:           Cloudflare (free tier — DNS, DDoS protection, caching)

BILLING:

\- Stripe (subscriptions, webhooks)

MESSAGING INTEGRATION (Killer Feature):

\- Telegram Bot API (receive files via Telegram)

\- WhatsApp Business API via Twilio or Meta Cloud API

---

## SECTION 4 — VPS INFRASTRUCTURE: STEP-BY-STEP SETUP

### PHASE 0: Buy & Configure the VPS

**Step 0.1 — Create DigitalOcean Droplet**

\# Choose:

\# \- Image: Ubuntu 24.04 LTS

\# \- Plan: Basic — 2 vCPU, 4GB RAM, 80GB SSD (\~$24/month)

\# \- Datacenter: New York 3 or San Francisco 3 (or closest to Mexico: Toronto)

\# \- Authentication: SSH Key (NEVER password)

\# \- Enable: Monitoring, Backups (add $4.80/month)

\# \- Hostname: visualgv-production

**Step 0.2 — Point your domain**

In Cloudflare (or your DNS provider):

A record:   visualgv.com      → \[YOUR\_VPS\_IP\]

A record:   www.visualgv.com  → \[YOUR\_VPS\_IP\]

A record:   api.visualgv.com  → \[YOUR\_VPS\_IP\]   (future API subdomain)

**Step 0.3 — First login & secure the server**

\# SSH into your VPS

ssh root@YOUR\_VPS\_IP

\# Update system

apt update && apt upgrade \-y

\# Create non-root deploy user

adduser deploy

usermod \-aG sudo deploy

\# Copy SSH keys to deploy user

rsync \--archive \--chown=deploy:deploy \~/.ssh /home/deploy

\# Disable root SSH login

nano /etc/ssh/sshd\_config

\# Set: PermitRootLogin no

\# Set: PasswordAuthentication no

systemctl restart sshd

\# Basic firewall

ufw allow OpenSSH

ufw allow 80

ufw allow 443

ufw enable

\# Switch to deploy user for all future work

su \- deploy

**Step 0.4 — Install core dependencies**

\# Install Node.js 20 LTS via NVM

curl \-o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

source \~/.bashrc

nvm install 20

nvm use 20

nvm alias default 20

\# Install PM2

npm install \-g pm2

\# Install Docker & Docker Compose

curl \-fsSL https://get.docker.com | sh

sudo usermod \-aG docker deploy

newgrp docker

\# Install Nginx

sudo apt install nginx \-y

\# Install Certbot

sudo apt install certbot python3-certbot-nginx \-y

\# Install Git

sudo apt install git \-y

**Step 0.5 — Set up Docker Compose for PostgreSQL \+ Redis**

mkdir \-p /home/deploy/visualgv/infrastructure

cd /home/deploy/visualgv/infrastructure

Create `docker-compose.yml`:

version: '3.9'

services:

  postgres:

    image: postgres:16-alpine

    container\_name: visualgv\_postgres

    restart: always

    environment:

      POSTGRES\_USER: ${POSTGRES\_USER}

      POSTGRES\_PASSWORD: ${POSTGRES\_PASSWORD}

      POSTGRES\_DB: visualgv\_production

    volumes:

      \- postgres\_data:/var/lib/postgresql/data

    ports:

      \- "127.0.0.1:5432:5432"   \# Only accessible locally

    

  redis:

    image: redis:7-alpine

    container\_name: visualgv\_redis

    restart: always

    command: redis-server \--requirepass ${REDIS\_PASSWORD}

    volumes:

      \- redis\_data:/data

    ports:

      \- "127.0.0.1:6379:6379"   \# Only accessible locally

volumes:

  postgres\_data:

  redis\_data:

\# Create .env file for docker-compose

cat \> .env \<\< 'EOF'

POSTGRES\_USER=visualgv\_user

POSTGRES\_PASSWORD=CHANGE\_THIS\_STRONG\_PASSWORD\_32CHARS

REDIS\_PASSWORD=CHANGE\_THIS\_REDIS\_PASSWORD\_32CHARS

EOF

\# Start the databases

docker compose up \-d

\# Verify

docker compose ps

**Step 0.6 — Configure Nginx as reverse proxy**

sudo nano /etc/nginx/sites-available/visualgv

server {

    listen 80;

    server\_name visualgv.com www.visualgv.com;

    

    \# Redirect HTTP to HTTPS (Certbot will update this)

    return 301 https://$server\_name$request\_uri;

}

server {

    listen 443 ssl;

    server\_name visualgv.com www.visualgv.com;

    

    \# SSL (Certbot will populate these)

    ssl\_certificate /etc/letsencrypt/live/visualgv.com/fullchain.pem;

    ssl\_certificate\_key /etc/letsencrypt/live/visualgv.com/privkey.pem;

    

    \# Security headers

    add\_header X-Frame-Options "SAMEORIGIN" always;

    add\_header X-Content-Type-Options "nosniff" always;

    add\_header Referrer-Policy "no-referrer-when-downgrade" always;

    add\_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;

    

    \# File upload size (for large advertising files)

    client\_max\_body\_size 500M;

    

    \# Proxy to Next.js app running on port 3000

    location / {

        proxy\_pass http://127.0.0.1:3000;

        proxy\_http\_version 1.1;

        proxy\_set\_header Upgrade $http\_upgrade;

        proxy\_set\_header Connection 'upgrade';

        proxy\_set\_header Host $host;

        proxy\_set\_header X-Real-IP $remote\_addr;

        proxy\_set\_header X-Forwarded-For $proxy\_add\_x\_forwarded\_for;

        proxy\_set\_header X-Forwarded-Proto $scheme;

        proxy\_cache\_bypass $http\_upgrade;

        proxy\_read\_timeout 300s;

    }

    

    \# Static files cache

    location /\_next/static {

        proxy\_pass http://127.0.0.1:3000;

        add\_header Cache-Control "public, max-age=31536000, immutable";

    }

}

\# Enable site

sudo ln \-s /etc/nginx/sites-available/visualgv /etc/nginx/sites-enabled/

sudo nginx \-t

sudo systemctl reload nginx

\# Get SSL certificate

sudo certbot \--nginx \-d visualgv.com \-d www.visualgv.com

\# Auto-renew SSL

sudo systemctl enable certbot.timer

**Step 0.7 — Set up GitHub Actions for CI/CD**

Create `.github/workflows/deploy.yml` in your repo:

name: Deploy to Production

on:

  push:

    branches: \[main\]

jobs:

  deploy:

    runs-on: ubuntu-latest

    steps:

      \- uses: actions/checkout@v4

      

      \- name: Deploy via SSH

        uses: appleboy/ssh-action@master

        with:

          host: ${{ secrets.VPS\_HOST }}

          username: deploy

          key: ${{ secrets.VPS\_SSH\_KEY }}

          script: |

            cd /home/deploy/visualgv/app

            git pull origin main

            npm ci

            npx prisma migrate deploy

            npm run build

            pm2 restart visualgv \--update-env

---

## SECTION 5 — PROJECT ARCHITECTURE & FILE STRUCTURE

visualgv/

├── app/                          \# Next.js App Router

│   ├── (auth)/                   \# Auth group (no sidebar)

│   │   ├── login/page.tsx

│   │   ├── register/page.tsx

│   │   └── forgot-password/page.tsx

│   ├── (marketing)/              \# Landing page group

│   │   └── page.tsx              \# Marketing landing page

│   ├── (dashboard)/              \# Main app (with sidebar)

│   │   ├── layout.tsx            \# Dashboard layout with sidebar

│   │   ├── dashboard/page.tsx    \# Home overview

│   │   ├── organizations/

│   │   ├── people/

│   │   ├── files/

│   │   │   ├── page.tsx

│   │   │   ├── chats/page.tsx

│   │   │   └── authorization/page.tsx

│   │   ├── industries/

│   │   │   ├── printing/page.tsx

│   │   │   └── installation/page.tsx

│   │   ├── inventory/page.tsx

│   │   ├── match-zone/page.tsx

│   │   ├── evidences/page.tsx

│   │   ├── reports/page.tsx

│   │   └── settings/page.tsx

│   ├── api/                      \# API routes

│   │   ├── auth/\[...nextauth\]/route.ts

│   │   ├── organizations/route.ts

│   │   ├── files/route.ts

│   │   ├── files/upload/route.ts

│   │   ├── campaigns/route.ts

│   │   ├── inventory/route.ts

│   │   ├── webhooks/stripe/route.ts

│   │   ├── webhooks/telegram/route.ts

│   │   └── trpc/\[trpc\]/route.ts  \# Optional: tRPC

│   └── layout.tsx                \# Root layout

│

├── components/

│   ├── ui/                       \# shadcn/ui auto-generated

│   ├── layout/

│   │   ├── Sidebar.tsx

│   │   ├── Header.tsx

│   │   └── DashboardLayout.tsx

│   ├── modules/                  \# One folder per module

│   │   ├── organizations/

│   │   ├── files/

│   │   ├── inventory/

│   │   └── reports/

│   └── shared/                   \# Reusable across modules

│       ├── FileUploadZone.tsx

│       ├── ThumbnailCard.tsx

│       ├── InviteUserModal.tsx

│       └── StatusBadge.tsx

│

├── lib/

│   ├── prisma.ts                 \# Prisma client singleton

│   ├── auth.ts                   \# NextAuth config

│   ├── stripe.ts                 \# Stripe client

│   ├── s3.ts                     \# S3/Spaces file operations

│   ├── email.ts                  \# Resend email client

│   ├── redis.ts                  \# Redis client

│   └── validations/              \# Zod schemas

│       ├── organization.ts

│       ├── file.ts

│       └── user.ts

│

├── prisma/

│   ├── schema.prisma             \# Full database schema

│   └── migrations/               \# Auto-generated migrations

│

├── hooks/                        \# Custom React hooks

│   ├── useOrganization.ts

│   ├── useFiles.ts

│   └── useCurrentUser.ts

│

├── store/                        \# Zustand global state

│   ├── organizationStore.ts

│   └── uiStore.ts

│

├── types/                        \# TypeScript interfaces

│   └── index.ts

│

├── public/

│   └── assets/

│

├── .env.local                    \# Local environment variables

├── .env.production               \# Production variables (on VPS only)

├── docker-compose.yml            \# Infrastructure

├── ecosystem.config.js           \# PM2 config

├── CLAUDE.md                     \# AI assistant rules (this file\!)

└── README.md

---

## SECTION 6 — DATABASE SCHEMA (Prisma)

Save this as `prisma/schema.prisma`:

generator client {

  provider \= "prisma-client-js"

}

datasource db {

  provider \= "postgresql"

  url      \= env("DATABASE\_URL")

}

// \==========================================

// AUTHENTICATION & USERS

// \==========================================

model User {

  id            String    @id @default(cuid())

  email         String    @unique

  emailVerified DateTime?

  name          String?

  image         String?

  password      String?   // Hashed with bcrypt

  role          UserRole  @default(USER)

  createdAt     DateTime  @default(now())

  updatedAt     DateTime  @updatedAt

  // Relations

  accounts          Account\[\]

  sessions          Session\[\]

  memberships       OrganizationMember\[\]

  filesUploaded     File\[\]

  chatMessages      ChatMessage\[\]

  auditLogs         AuditLog\[\]

  @@map("users")

}

enum UserRole {

  SUPER\_ADMIN   // visualgv.com staff

  USER          // Regular paying user

}

model Account {

  id                String  @id @default(cuid())

  userId            String

  type              String

  provider          String

  providerAccountId String

  refresh\_token     String? @db.Text

  access\_token      String? @db.Text

  expires\_at        Int?

  token\_type        String?

  scope             String?

  id\_token          String? @db.Text

  session\_state     String?

  user              User    @relation(fields: \[userId\], references: \[id\], onDelete: Cascade)

  @@unique(\[provider, providerAccountId\])

  @@map("accounts")

}

model Session {

  id           String   @id @default(cuid())

  sessionToken String   @unique

  userId       String

  expires      DateTime

  user         User     @relation(fields: \[userId\], references: \[id\], onDelete: Cascade)

  @@map("sessions")

}

model VerificationToken {

  identifier String

  token      String   @unique

  expires    DateTime

  @@unique(\[identifier, token\])

  @@map("verification\_tokens")

}

// \==========================================

// MULTI-TENANCY: ORGANIZATIONS & CAMPAIGNS

// \==========================================

model Organization {

  id          String   @id @default(cuid())

  name        String

  slug        String   @unique  // URL-safe name

  logoUrl     String?

  industry    String?

  createdAt   DateTime @default(now())

  updatedAt   DateTime @updatedAt

  // Billing

  stripeCustomerId     String? @unique

  stripeSubscriptionId String? @unique

  plan                 PlanType @default(FREE)

  planExpiresAt        DateTime?

  // Relations

  members      OrganizationMember\[\]

  campaigns    Campaign\[\]

  files        File\[\]

  assets       Asset\[\]

  invitations  Invitation\[\]

  @@map("organizations")

}

enum PlanType {

  FREE

  STARTER

  PRO

  ENTERPRISE

}

model OrganizationMember {

  id             String           @id @default(cuid())

  organizationId String

  userId         String

  role           MemberRole       @default(VIEWER)

  joinedAt       DateTime         @default(now())

  

  organization   Organization     @relation(fields: \[organizationId\], references: \[id\], onDelete: Cascade)

  user           User             @relation(fields: \[userId\], references: \[id\], onDelete: Cascade)

  @@unique(\[organizationId, userId\])

  @@map("organization\_members")

}

enum MemberRole {

  OWNER         // Full control

  ADMIN         // Can invite, manage campaigns

  EDITOR        // Can upload, edit files

  VIEWER        // Read-only

}

model Invitation {

  id             String       @id @default(cuid())

  email          String

  organizationId String

  role           MemberRole   @default(VIEWER)

  token          String       @unique @default(cuid())

  expiresAt      DateTime

  acceptedAt     DateTime?

  createdAt      DateTime     @default(now())

  

  organization   Organization @relation(fields: \[organizationId\], references: \[id\], onDelete: Cascade)

  @@map("invitations")

}

model Campaign {

  id             String       @id @default(cuid())

  name           String

  description    String?

  organizationId String

  startDate      DateTime?

  endDate        DateTime?

  budget         Decimal?     @db.Decimal(12, 2\)

  status         CampaignStatus @default(ACTIVE)

  createdAt      DateTime     @default(now())

  updatedAt      DateTime     @updatedAt

  organization   Organization @relation(fields: \[organizationId\], references: \[id\], onDelete: Cascade)

  files          File\[\]

  printOrders    PrintOrder\[\]

  installations  Installation\[\]

  @@map("campaigns")

}

enum CampaignStatus {

  DRAFT

  ACTIVE

  COMPLETED

  ARCHIVED

}

// \==========================================

// FILES & DIGITAL ASSET MANAGEMENT

// \==========================================

model File {

  id             String      @id @default(cuid())

  name           String

  originalName   String

  mimeType       String

  sizeBytes      Int

  storageKey     String      // S3 key or URL

  thumbnailKey   String?     // Thumbnail S3 key

  externalUrl    String?     // For Drive/Dropbox/OneDrive links

  source         FileSource  @default(UPLOAD)

  status         FileStatus  @default(PENDING)

  version        Int         @default(1)

  

  organizationId String

  campaignId     String?

  uploadedById   String

  

  createdAt      DateTime    @default(now())

  updatedAt      DateTime    @updatedAt

  organization   Organization    @relation(fields: \[organizationId\], references: \[id\], onDelete: Cascade)

  campaign       Campaign?       @relation(fields: \[campaignId\], references: \[id\])

  uploadedBy     User            @relation(fields: \[uploadedById\], references: \[id\])

  

  chatMessages   ChatMessage\[\]

  printOrders    PrintOrder\[\]

  evidences      Evidence\[\]

  matchZones     MatchZone\[\]

  @@map("files")

}

enum FileSource {

  UPLOAD        // Direct upload

  EXTERNAL\_URL  // Google Drive, Dropbox, etc.

  TELEGRAM      // Received via Telegram bot

  WHATSAPP      // Received via WhatsApp

}

enum FileStatus {

  PENDING       // Just uploaded

  IN\_REVIEW     // Under authorization chat

  AUTHORIZED    // Approved

  REJECTED      // Rejected in authorization

  SENT\_TO\_PRINT

  SENT\_TO\_INSTALL

  MATCHED       // Matched with a physical asset

}

// File authorization chat

model ChatMessage {

  id        String   @id @default(cuid())

  fileId    String

  userId    String

  content   String   @db.Text

  isAuthorization Boolean @default(false)  // Is this the formal approval?

  createdAt DateTime @default(now())

  file      File     @relation(fields: \[fileId\], references: \[id\], onDelete: Cascade)

  user      User     @relation(fields: \[userId\], references: \[id\])

  @@map("chat\_messages")

}

// \==========================================

// INDUSTRIES: PRINT & INSTALL ORDERS

// \==========================================

model PrintOrder {

  id           String      @id @default(cuid())

  fileId       String

  campaignId   String

  machine      String?     // Printing machine name

  material     String?     // Substrate material

  width        Decimal?    @db.Decimal(8, 2\)

  height       Decimal?    @db.Decimal(8, 2\)

  quantity     Int         @default(1)

  finishes     String?     // Special finishes notes

  status       PrintStatus @default(PENDING)

  notes        String?     @db.Text

  createdAt    DateTime    @default(now())

  updatedAt    DateTime    @updatedAt

  file         File        @relation(fields: \[fileId\], references: \[id\])

  campaign     Campaign    @relation(fields: \[campaignId\], references: \[id\])

  installation Installation?

  @@map("print\_orders")

}

enum PrintStatus {

  PENDING

  IN\_PROGRESS

  PRINTED

  SENT\_TO\_INSTALL

}

model Installation {

  id           String            @id @default(cuid())

  printOrderId String            @unique

  campaignId   String

  assetId      String?           // Physical asset to install on

  status       InstallStatus     @default(PENDING)

  installedAt  DateTime?

  notes        String?           @db.Text

  createdAt    DateTime          @default(now())

  updatedAt    DateTime          @updatedAt

  printOrder   PrintOrder        @relation(fields: \[printOrderId\], references: \[id\])

  campaign     Campaign          @relation(fields: \[campaignId\], references: \[id\])

  asset        Asset?            @relation(fields: \[assetId\], references: \[id\])

  evidences    Evidence\[\]

  matchZone    MatchZone?

  @@map("installations")

}

enum InstallStatus {

  PENDING

  IN\_PROGRESS

  INSTALLED

  WITH\_EVIDENCE

}

// \==========================================

// ASSET INVENTORY (Physical Locations)

// \==========================================

model Asset {

  id             String      @id @default(cuid())

  name           String

  sku            String?     // Company SKU / QR code value

  type           AssetType

  subType        String?

  organizationId String

  

  // Location

  address        String?

  latitude       Decimal?    @db.Decimal(10, 8\)

  longitude      Decimal?    @db.Decimal(11, 8\)

  

  // Physical specs

  width          Decimal?    @db.Decimal(8, 2\)

  height         Decimal?    @db.Decimal(8, 2\)

  faces          Int         @default(1)

  

  thumbnailUrl   String?

  notes          String?     @db.Text

  isActive       Boolean     @default(true)

  createdAt      DateTime    @default(now())

  updatedAt      DateTime    @updatedAt

  organization   Organization  @relation(fields: \[organizationId\], references: \[id\], onDelete: Cascade)

  installations  Installation\[\]

  matchZones     MatchZone\[\]

  @@map("assets")

}

enum AssetType {

  PHYSICAL\_FIXED     // Billboard, bus shelter

  PHYSICAL\_MOBILE    // Truck with print

  DIGITAL\_FIXED      // Digital screen

  DIGITAL\_MOBILE     // Truck with digital screen

}

// \==========================================

// MATCH ZONE

// \==========================================

model MatchZone {

  id             String      @id @default(cuid())

  fileId         String

  assetId        String

  installationId String?     @unique

  matchedAt      DateTime    @default(now())

  notes          String?

  file           File        @relation(fields: \[fileId\], references: \[id\])

  asset          Asset       @relation(fields: \[assetId\], references: \[id\])

  installation   Installation? @relation(fields: \[installationId\], references: \[id\])

  @@map("match\_zones")

}

// \==========================================

// EVIDENCES (Photo Proof)

// \==========================================

model Evidence {

  id             String     @id @default(cuid())

  installationId String

  fileId         String?

  storageKey     String     // S3 key of the photo

  latitude       Decimal?   @db.Decimal(10, 8\)

  longitude      Decimal?   @db.Decimal(11, 8\)

  capturedAt     DateTime   @default(now())

  notes          String?

  installation   Installation @relation(fields: \[installationId\], references: \[id\])

  file           File?        @relation(fields: \[fileId\], references: \[id\])

  @@map("evidences")

}

// \==========================================

// AUDIT LOG

// \==========================================

model AuditLog {

  id         String   @id @default(cuid())

  userId     String?

  action     String   // e.g., "FILE\_AUTHORIZED", "PRINT\_ORDER\_CREATED"

  entityType String   // e.g., "File", "PrintOrder"

  entityId   String

  metadata   Json?

  createdAt  DateTime @default(now())

  user       User?    @relation(fields: \[userId\], references: \[id\])

  @@map("audit\_logs")

}

---

## SECTION 7 — MVP BUILD SEQUENCE (Step-by-Step)

Follow this order exactly. Do NOT skip ahead.

### ✅ PHASE 1: PROJECT SCAFFOLD (Day 1\)

Step 1.1: Create Next.js project

  npx create-next-app@latest visualgv \--typescript \--tailwind \--eslint \--app \--src-dir=no

  cd visualgv

Step 1.2: Install all dependencies

  npx shadcn@latest init

  npm install @prisma/client prisma

  npm install next-auth@beta @auth/prisma-adapter

  npm install zod react-hook-form @hookform/resolvers

  npm install @tanstack/react-query zustand

  npm install lucide-react

  npm install stripe @stripe/stripe-js

  npm install resend

  npm install ioredis bullmq

  npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner

  npm install uploadthing @uploadthing/react    \# Simpler S3 alternative

Step 1.3: Install shadcn/ui components

  npx shadcn@latest add button input label card dialog

  npx shadcn@latest add form select textarea badge

  npx shadcn@latest add table dropdown-menu sidebar

  npx shadcn@latest add avatar tooltip sheet tabs

  npx shadcn@latest add progress skeleton toast

Step 1.4: Set up Prisma

  npx prisma init

  \# Paste the full schema from Section 6 into prisma/schema.prisma

  npx prisma generate

  npx prisma migrate dev \--name init

Step 1.5: Set up environment variables

  \# Create .env.local with all keys (see Section 8 for the full list)

### ✅ PHASE 2: AUTHENTICATION (Day 1-2)

Step 2.1: Configure NextAuth v5 (lib/auth.ts)

  \- Google OAuth provider

  \- Email magic link provider (Resend)

  \- Prisma adapter

  \- Session callback to add orgId and role to JWT

Step 2.2: Build auth pages

  \- /login page with Google button \+ email input

  \- /register page (email \+ password)

  \- /forgot-password page

Step 2.3: Build auth middleware (middleware.ts)

  \- Protect all /dashboard/\* routes

  \- Redirect unauthenticated users to /login

Step 2.4: Test end-to-end login flow

### ✅ PHASE 3: DASHBOARD SHELL (Day 2-3)

Step 3.1: Build the Sidebar component

  \- Left sidebar, 20% width (golden ratio)

  \- Navigation items matching Section 9 (Design)

  \- Collapsible hamburger menu

  \- Expandable sub-items for Files and Industries

  \- Active state highlighting

Step 3.2: Build the Header component

  \- visualgv.com logo top-left

  \- Global search bar (non-functional placeholder for now)

  \- User avatar \+ dropdown (profile, settings, logout) top-right

Step 3.3: Build the DashboardLayout

  \- Sidebar \+ Header wrapping all dashboard pages

  \- Responsive: sidebar collapses on mobile

Step 3.4: Build the main Dashboard home page

  \- Stats cards: Total Files, Active Campaigns, Assets, Pending Installs

  \- Recent activity feed

  \- Quick actions

### ✅ PHASE 4: ORGANIZATIONS MODULE (Day 3-4)

Step 4.1: API routes

  GET    /api/organizations         \- List user's orgs

  POST   /api/organizations         \- Create org

  PATCH  /api/organizations/\[id\]    \- Update org

  DELETE /api/organizations/\[id\]    \- Delete org (with confirmation)

  POST   /api/organizations/\[id\]/invite  \- Invite user by email

Step 4.2: UI

  \- Organization list with search

  \- Create org form (modal)

  \- Org settings page (edit name, logo)

  \- Invite members by email

  \- Members list with role management

Step 4.3: Organization context

  \- Org switcher in sidebar header

  \- All queries scoped to currentOrgId

  \- Zustand store: useOrganizationStore

### ✅ PHASE 5: CAMPAIGNS MODULE (Day 4-5)

Step 5.1: API routes

  GET    /api/campaigns             \- List campaigns for current org

  POST   /api/campaigns             \- Create campaign

  PATCH  /api/campaigns/\[id\]        \- Update

  DELETE /api/campaigns/\[id\]        \- Delete (with warning: deletes all data)

Step 5.2: UI

  \- Campaign cards grid

  \- Create/Edit campaign drawer (name, dates, budget)

  \- Campaign detail page showing all related files, print orders, etc.

  \- Status badge (Draft / Active / Completed / Archived)

### ✅ PHASE 6: FILES MODULE (Day 5-7)

Step 6.1: File upload API

  \- UploadThing route for direct S3 upload

  \- POST /api/files \- save file metadata to DB

  \- Auto-generate thumbnail for common types (Sharp library)

Step 6.2: External URL capture

  \- Form to paste Google Drive / Dropbox / OneDrive URLs

  \- Store as externalUrl in File record

Step 6.3: Files UI

  \- Drag & drop upload zone (react-dropzone)

  \- Grid of file thumbnail cards

  \- File card: thumbnail, name, status badge, 3-dot menu

  \- 3-dot menu actions: View, Rename, Share, Send to Print, Archive

Step 6.4: Authorization Chat

  \- Real-time chat per file (Pusher)

  \- Left/right message bubbles

  \- "Authorize" button that updates file status

  \- Notification to invited collaborators via email (Resend)

### ✅ PHASE 7: INDUSTRIES (PRINT & INSTALL) (Day 7-9)

Step 7.1: Print Orders

  \- List of files with status AUTHORIZED

  \- Create print order: machine, material, dimensions, quantity, finishes

  \- Status workflow: Pending → In Progress → Printed → Sent to Install

Step 7.2: Installation Orders

  \- List of files sent from Print with PRINTED status

  \- Status workflow: Pending → In Progress → Installed → With Evidence

  \- Assign to Asset from Inventory

  \- "Send to Match Zone" button

### ✅ PHASE 8: ASSET INVENTORY (Day 9-10)

Step 8.1: Asset CRUD API

  \- Create / Read / Update / Delete assets

  \- CSV import for bulk upload

Step 8.2: Asset UI

  \- Table \+ card view

  \- Create asset form: name, SKU, type, address, GPS coordinates

  \- Google Maps embed showing asset location pin

  \- QR code generation for each asset (qrcode library)

Step 8.3: GPS Capture (Mobile)

  \- "Use My Location" button using browser Geolocation API

  \- Auto-fill lat/long when creating or updating an asset

### ✅ PHASE 9: MATCH ZONE (Day 10-11)

Step 9.1: Match Zone page

  \- Left panel: Files sent to Match Zone (FileStatus \= SENT\_TO\_INSTALL)

  \- Right panel: Available Assets from Inventory

  \- Drag file thumbnail onto asset card to create a match

  \- Or: dropdown "Select Asset" per file

Step 9.2: Match creation API

  POST /api/match-zones \- create a MatchZone record

  \- Updates File status to MATCHED

  \- Updates Installation status to INSTALLED

### ✅ PHASE 10: EVIDENCES (Day 11-12)

Step 10.1: Evidence upload

  \- Photo upload per Installation (drag & drop or camera on mobile)

  \- Auto-capture GPS location when uploading from phone

  \- Attach evidence to a matched Installation

Step 10.2: Evidence gallery

  \- Grid of evidence photos per campaign

  \- Status badge on Installation when evidence is attached

### ✅ PHASE 11: REPORTS (Day 12-13)

Step 11.1: Report data API

  GET /api/reports/summary \- returns all KPIs:

  \- Files by status (pie chart)

  \- Campaign progress (bar chart)

  \- Asset utilization

  \- Installation completion rate

Step 11.2: Reports UI

  \- KPI summary cards

  \- Recharts bar and pie charts

  \- Filter by Organization, Campaign, Date range

  \- Export to PDF (react-pdf) or CSV

### ✅ PHASE 12: BILLING (Day 13-14)

Step 12.1: Stripe integration

  \- Create Stripe products: Starter $29/mo, Pro $79/mo, Enterprise custom

  \- Subscription checkout via Stripe Checkout

  \- Webhook handler: /api/webhooks/stripe

    \- Handles: subscription.created, subscription.updated, subscription.deleted

Step 12.2: Billing UI

  \- /settings/billing page

  \- Current plan display

  \- Upgrade/downgrade buttons

  \- Invoice history

Step 12.3: Plan enforcement middleware

  \- Check org plan before allowing file uploads (storage limit)

  \- Check user count per plan

  \- Show upgrade prompt when limit reached

### ✅ PHASE 13: TELEGRAM BOT (Killer Feature) (Day 14-15)

Step 13.1: Create Telegram Bot

  \- Register bot with @BotFather

  \- Get bot token

Step 13.2: Webhook endpoint

  POST /api/webhooks/telegram

  \- Verify Telegram webhook signature

  \- When a file is sent to the bot:

    1\. Identify user by Telegram userId mapped to visualgv User

    2\. Download file from Telegram servers

    3\. Upload to S3

    4\. Create File record in DB with source: TELEGRAM

    5\. Send confirmation message back via Telegram

Step 13.3: User linking

  \- In settings, user generates a unique Telegram link code

  \- Bot receives /link CODE command and connects accounts

### ✅ PHASE 14: LANDING PAGE (Day 15\)

Step 14.1: Marketing landing page at /

  \- Hero: "The command center for your outdoor advertising campaigns"

  \- Features section: one card per module

  \- Pricing section: 3 tier cards

  \- Social proof / testimonials placeholder

  \- CTA: "Start free trial" → /register

  \- Footer

Step 14.2: SEO

  \- Next.js metadata API for each page

  \- OpenGraph tags

  \- Sitemap.xml

---

## SECTION 8 — ENVIRONMENT VARIABLES

Create `.env.local` locally and `.env` on the VPS:

\# App

NEXT\_PUBLIC\_APP\_URL=https://visualgv.com

NODE\_ENV=production

\# Database

DATABASE\_URL=postgresql://visualgv\_user:PASSWORD@127.0.0.1:5432/visualgv\_production

\# Redis

REDIS\_URL=redis://:REDIS\_PASSWORD@127.0.0.1:6379

\# Auth (NextAuth)

AUTH\_SECRET=GENERATE\_WITH: openssl rand \-base64 32

AUTH\_GOOGLE\_ID=from Google Cloud Console

AUTH\_GOOGLE\_SECRET=from Google Cloud Console

\# Email (Resend)

RESEND\_API\_KEY=re\_xxxxxxxx

EMAIL\_FROM=noreply@visualgv.com

\# File Storage (DigitalOcean Spaces — S3 compatible)

DO\_SPACES\_KEY=your\_spaces\_key

DO\_SPACES\_SECRET=your\_spaces\_secret

DO\_SPACES\_ENDPOINT=https://nyc3.digitaloceanspaces.com

DO\_SPACES\_BUCKET=visualgv-files

DO\_SPACES\_CDN\_URL=https://visualgv-files.nyc3.cdn.digitaloceanspaces.com

\# OR: AWS S3

AWS\_ACCESS\_KEY\_ID=

AWS\_SECRET\_ACCESS\_KEY=

AWS\_REGION=us-east-1

AWS\_S3\_BUCKET=visualgv-files

\# Stripe

STRIPE\_SECRET\_KEY=sk\_live\_xxxx

STRIPE\_WEBHOOK\_SECRET=whsec\_xxxx

NEXT\_PUBLIC\_STRIPE\_PUBLISHABLE\_KEY=pk\_live\_xxxx

STRIPE\_STARTER\_PRICE\_ID=price\_xxxx

STRIPE\_PRO\_PRICE\_ID=price\_xxxx

\# Telegram

TELEGRAM\_BOT\_TOKEN=xxxx:xxxx

\# Real-time (Pusher)

PUSHER\_APP\_ID=

PUSHER\_KEY=

PUSHER\_SECRET=

PUSHER\_CLUSTER=

NEXT\_PUBLIC\_PUSHER\_KEY=

NEXT\_PUBLIC\_PUSHER\_CLUSTER=

\# Google Maps

NEXT\_PUBLIC\_GOOGLE\_MAPS\_API\_KEY=

\# Sentry (Error monitoring)

SENTRY\_DSN=

---

## SECTION 9 — DESIGN SYSTEM

### Layout

- **Structure**: 2-column layout — fixed left sidebar (20% / golden ratio) \+ main content area (80%)  
- **Sidebar background**: `#F8F9FA` (very light gray)  
- **Main content background**: `#FFFFFF` (pure white)  
- **Card background**: `#FFFFFF` with subtle border `#E5E7EB`  
- **Responsive**: Sidebar collapses to icon-only on tablet, drawer on mobile

### Color Palette

\--color-primary: \#111827;      /\* Near black — main text, buttons \*/

\--color-secondary: \#6B7280;    /\* Medium gray — labels, subtitles \*/

\--color-accent: \#10B981;       /\* Medium green — positive metrics, success \*/

\--color-danger: \#EF4444;       /\* Red — errors, delete actions \*/

\--color-warning: \#F59E0B;      /\* Amber — pending status \*/

\--color-sidebar: \#F8F9FA;      /\* Sidebar background \*/

\--color-border: \#E5E7EB;       /\* Subtle borders \*/

\--color-hover: \#F3F4F6;        /\* Sidebar item hover \*/

### Typography

- **Font**: Inter (Google Fonts)  
- Large metric values: 36px, regular weight  
- Card titles: 18px, semibold  
- Body / labels: 14px, medium gray  
- Navigation items: 14px, medium weight

### Sidebar Navigation Order

📁 Organizations

👥 People

📄 Files              ▼ expandable

   ├─ Files to Create

   ├─ Chats

   └─ Authorization

🏭 Industries          ▼ expandable

   ├─ Printing

   └─ Installation

📦 Inventory of Assets

🔗 Match Zone

📸 Evidences

📊 Reports

─────────────────────

⚙️  Settings

💳 Billing

🔒 Augmented Reality   \[Coming Soon badge\]

🛰️  GPS Tracking       \[Coming Soon badge\]

---

## SECTION 10 — PM2 PRODUCTION CONFIG

Create `ecosystem.config.js` in project root:

module.exports \= {

  apps: \[

    {

      name: 'visualgv',

      script: 'node\_modules/.bin/next',

      args: 'start',

      instances: 2,             // 2 CPU cores

      exec\_mode: 'cluster',     // Load balance between instances

      env\_production: {

        NODE\_ENV: 'production',

        PORT: 3000,

      },

      // Auto-restart on crash

      autorestart: true,

      watch: false,

      max\_memory\_restart: '1G',

      

      // Logging

      error\_file: '/home/deploy/logs/visualgv-error.log',

      out\_file: '/home/deploy/logs/visualgv-out.log',

      log\_date\_format: 'YYYY-MM-DD HH:mm:ss',

    },

  \],

};

\# Start app in production

mkdir \-p /home/deploy/logs

cd /home/deploy/visualgv/app

npm run build

pm2 start ecosystem.config.js \--env production

pm2 save

pm2 startup   \# Follow the command it outputs to auto-start on reboot

---

## SECTION 11 — QUICK COMMANDS REFERENCE

\# On VPS: deploy new version

cd /home/deploy/visualgv/app

git pull origin main

npm ci

npx prisma migrate deploy

npm run build

pm2 restart visualgv

\# On VPS: view logs

pm2 logs visualgv

pm2 monit

\# On VPS: database backup

docker exec visualgv\_postgres pg\_dump \-U visualgv\_user visualgv\_production \> backup\_$(date \+%Y%m%d).sql

\# Local development

npm run dev           \# Start Next.js dev server

npx prisma studio     \# Open visual DB browser

npx prisma migrate dev \--name your\_migration\_name

---

## SECTION 12 — MVP LAUNCH CHECKLIST

Before going live, verify every item:

SECURITY:

\[ \] All .env secrets rotated from any dev values

\[ \] Nginx HTTPS working with valid SSL cert

\[ \] SSH root login disabled

\[ \] Firewall: only ports 22, 80, 443 open

\[ \] CORS configured: only allow visualgv.com origin

\[ \] Rate limiting on auth endpoints (next-rate-limit)

\[ \] Input validation (Zod) on all API routes

FUNCTIONALITY:

\[ \] User can register and log in (email \+ Google)

\[ \] User can create an Organization

\[ \] User can create a Campaign

\[ \] User can upload a file (drag & drop \+ browse)

\[ \] File authorization chat works in real-time

\[ \] Print order can be created and status updated

\[ \] Installation order receives print and status updated

\[ \] Asset can be created with GPS coordinates

\[ \] File and asset can be matched in Match Zone

\[ \] Evidence photo can be uploaded with GPS

\[ \] Reports page shows correct data

\[ \] Stripe checkout works (test mode)

\[ \] Stripe webhook updates plan in DB

PERFORMANCE:

\[ \] Google Lighthouse score \> 80 on all pages

\[ \] Images: Next.js \<Image\> with lazy loading

\[ \] Database: Prisma indexes on all FK fields

\[ \] Redis caching on heavy queries (org file lists)

MONITORING:

\[ \] Sentry DSN configured and catching errors

\[ \] PM2 auto-restart enabled

\[ \] UptimeRobot monitoring visualgv.com

\[ \] DB backup script on cron (daily)

---

## SECTION 13 — FUTURE ROADMAP (Post-MVP)

Phase 2 — Augmented Reality

\- Use WebXR API or AR.js

\- Scan physical asset → overlay matched digital file

Phase 2 — GPS Live Tracking

\- Track mobile assets (trucks) via Geolocation API

\- Show on Google Maps in real-time

Phase 3 — WhatsApp Integration

\- Meta Cloud API or Twilio for WhatsApp

\- Same file-receive flow as Telegram

Phase 3 — Adobe Integration  

\- Pixlr API integration for in-browser file editing

\- adobe.io Creative SDK if released publicly

Phase 4 — Multi-language

\- Spanish \+ English (already planned in original docs)

\- i18next / next-intl

Phase 4 — Mobile App

\- React Native (Expo) sharing code with Next.js

\- Camera capture for evidences

\- QR code scanner for assets

\- Push notifications

Phase 5 — AI Features

\- Auto-categorize uploaded files

\- Smart match suggestions (AI matches files to assets)

\- Report generation with AI summary

---

*Document created: May 2026 — Based on full review of visualgv.com project documentation from Google Drive (2016–2026). Project owned by Gerardo Velázquez Carmona.*

*Use this as your CLAUDE.md, .cursorrules, or Gemini System Instructions.*  
