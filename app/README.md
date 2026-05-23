# visualgv.com — SaaS MVP

A production-grade multi-tenant B2B SaaS platform for managing outdoor advertising campaigns, digital assets, physical assets, and operational workflows.

## 🚀 Features

- **Multi-tenant Architecture**: Organizations, sub-folders, and collaborative access
- **Digital Asset Management**: Upload and manage artwork, designs, photos
- **Physical Asset Tracking**: Billboard, bus, poster, digital screen inventory
- **Operational Workflow**: File upload → authorization → approval → print → installation → GPS evidence
- **Real-time Collaboration**: Live chat for file authorization
- **Role-based Access**: Owner, Admin, Editor, Viewer roles
- **Payment Integration**: Stripe subscriptions with tiers
- **File Storage**: Direct S3 uploads with presigned URLs
- **Audit Logging**: Complete audit trail for compliance

## 🛠️ Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

```bash
docker compose up -d
npx prisma migrate dev
```

### 3. Environment Variables

```bash
cp .env.example .env.local
# Fill in your credentials
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

See [CLAUDE.md](./CLAUDE.md) for detailed project conventions and guidelines.

## 📚 Documentation

- [Master Prompt](../visualgv_MVP_Master_Prompt.md) - Complete specification
- [CLAUDE.md](./CLAUDE.md) - AI assistant rules
- [Database Schema](./prisma/schema.prisma)
- [API Routes](./app/api/)

## 🚢 Deployment

```bash
# On VPS
ssh deploy@your-vps-ip
cd /home/deploy/visualgv/app
git pull origin main
npm ci
npx prisma migrate deploy
npm run build
pm2 restart visualgv --update-env
```

## 📝 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm start            # Start production server
npm run lint         # Run linter
```

## 📄 License

Proprietary - All rights reserved

## 👤 Author

**Gerardo Velázquez Carmona** | [GitHub](https://github.com/Gerki) | [Website](https://visualgv.com)
