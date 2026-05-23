# visualgv.com — AI Assistant Rules & Context

This is your system prompt for building visualgv.com with AI assistance.

## Core Principles

- **Production-grade**: Write code that scales, with proper error handling and logging
- **Type-safe**: Use TypeScript strictly; never `any`; define all interfaces explicitly
- **Modular**: Keep files under 500 lines; split larger modules into smaller files
- **Documented**: Include inline comments explaining what each function does
- **UI-first**: Always use shadcn/ui components, never build primitives from scratch
- **Validated**: All API inputs must be validated with Zod; never trust user input
- **Tested**: Consider edge cases and error scenarios

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Node.js 20 LTS
- **Database**: PostgreSQL 16 + Prisma ORM
- **Cache**: Redis 7
- **Auth**: NextAuth.js v5 (Google OAuth + email/password)
- **File Storage**: AWS S3 / DigitalOcean Spaces
- **Email**: Resend.com
- **Payments**: Stripe
- **Real-time**: Pusher or Ably
- **Background Jobs**: BullMQ + Redis
- **Infrastructure**: Docker, Nginx, PM2, Ubuntu 24.04 LTS on DigitalOcean VPS

## Core Rules

- Always use `"use client"` only when necessary for interactivity
- Validate all API inputs with Zod schemas
- Check authentication with `auth()` before processing sensitive operations
- Log errors for debugging and monitoring
- Use TypeScript interfaces for all data structures
- Create reusable components and avoid duplication
- Follow file structure conventions

## When in Doubt

Ask one clarifying question before proceeding.

## Deployment

```bash
# On VPS:
cd /home/deploy/visualgv/app
git pull origin main
npm ci
npx prisma migrate deploy
npm run build
pm2 restart visualgv --update-env
```
