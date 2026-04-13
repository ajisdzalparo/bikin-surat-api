# BikinSurat API

Backend API untuk platform SaaS pembuatan surat otomatis berbasis AI.

## Tech Stack

- Node.js + Express (TypeScript)
- Prisma ORM + PostgreSQL
- JWT Authentication + RBAC
- Midtrans webhook integration
- OpenAI integration (document question + draft generation)
- PDF/DOCX export

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Setup environment variables

Buat file `.env` di root project.

Contoh minimal:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bikin-surat
PORT=8000
JWT_SECRET=your-secret
JWT_EXPIRES_IN=1d

MIDTRANS_SERVER_KEY=
MIDTRANS_IS_PRODUCTION=false

OPENAI_API_KEY=
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
```

Catatan:
- Jika `JWT_SECRET` kosong, mode development akan fallback ke secret internal dev.
- Jika `MIDTRANS_SERVER_KEY` kosong, checkout subscription menggunakan mode mock URL.
- Jika `OPENAI_API_KEY` kosong, modul AI akan fallback ke output default lokal.

### 3. Sync Prisma schema

```bash
npx prisma generate
npx prisma db push
```

### 4. Seed admin user

```bash
npm run seed
```

Default admin seed:
- Email: `admin@bikinsurat.local`
- Password: `admin12345`

Nilai ini bisa dioverride via env:
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

### 5. Run development server

```bash
npm run dev
```

API base URL lokal:
- `http://localhost:8000/api`

## Scripts

- `npm run dev` - jalankan server development
- `npm run seed` - seed admin ke database
- `npm run test` - placeholder smoke-test info

## API Documentation

Dokumentasi endpoint lengkap tersedia di:
- [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md)

## Main Modules

- `auth` - register, login, me, reset password
- `user` - update profile + admin user management
- `organizations` - organization profile (owner scoped)
- `subscription` - plans, checkout, current, cancel
- `payment` - Midtrans webhook endpoint
- `documents` - AI questions, generate document, history, export
- `admin` - stats, user control, transaction verify, template management

## Project Structure (ringkas)

- `src/app.ts` - app bootstrap + middlewares
- `src/server.ts` - http server start
- `src/routes/index.ts` - route mounting `/api/*`
- `src/modules/*` - domain modules
- `src/integrations/openai/*` - OpenAI provider
- `prisma/schema.prisma` - DB schema
- `prisma/seed.js` - seed script
