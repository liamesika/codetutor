# CodeTutor

A modern Java learning platform with adaptive learning, real-time code execution, and gamification features.

## Features

- **Adaptive Learning Algorithm**: Intelligently selects questions based on user performance
- **Docker-based Java Sandbox**: Secure, isolated code execution with memory/time limits
- **200+ Practice Questions**: Curriculum-aligned across 5 weeks covering CLI, strings, functions, arrays, and 2D arrays
- **Premium UI/UX**: Resizable panels, Monaco code editor with custom themes, Framer Motion animations
- **Admin Dashboard**: Analytics, question management, topic management, and algorithm debugging
- **Gamification**: XP points, streaks, achievements, and leaderboards
- **Security**: Rate limiting, audit logging, Sentry error tracking

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Cache**: Redis (for rate limiting)
- **Code Execution**: Docker sandbox
- **Authentication**: NextAuth.js
- **Monitoring**: Sentry

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL
- Redis (optional, for rate limiting)
- Docker (optional, for code execution sandbox)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd codetutor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database URL and other configuration.

4. Set up the database:
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. (Optional) Build the Docker sandbox:
   ```bash
   npm run sandbox:build
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

After seeding the database, you can use these accounts:

- **Demo User**: `demo@codetutor.dev` / `demo123`
- **Admin User**: `admin@codetutor.dev` / `admin123`

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with questions and demo accounts |
| `npm run db:reset` | Reset and reseed database |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Run tests with Playwright UI |
| `npm run sandbox:build` | Build Docker sandbox image |
| `npm run docker:up` | Start Docker services |
| `npm run docker:down` | Stop Docker services |

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `DATABASE_URL`: PostgreSQL connection string (use Vercel Postgres or external)
   - `NEXTAUTH_SECRET`: Random secret string
   - `NEXTAUTH_URL`: Your deployment URL
   - `SENTRY_DSN`: (Optional) Sentry DSN for error tracking

4. Deploy!

Note: Docker-based code execution is disabled on Vercel. For full functionality, deploy to a VM-based platform.

### Self-hosted (VM)

1. Set up PostgreSQL and Redis
2. Clone repository
3. Install dependencies: `npm install`
4. Build: `npm run build`
5. Build sandbox: `npm run sandbox:build`
6. Start services: `npm run docker:up`
7. Start server: `npm run start`

## Project Structure

```
codetutor/
├── docker/
│   └── java-sandbox/     # Docker sandbox for Java execution
├── e2e/                  # Playwright E2E tests
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── seed-full.ts      # Seed script
│   └── questions/        # Question bank (200+ questions)
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (admin)/      # Admin dashboard
│   │   ├── (dashboard)/  # User dashboard
│   │   ├── api/          # API routes
│   │   └── auth/         # Auth pages
│   ├── components/       # React components
│   │   ├── admin/        # Admin components
│   │   ├── practice/     # Practice components
│   │   └── ui/           # UI components (shadcn)
│   └── lib/              # Utilities
│       ├── audit.ts      # Audit logging
│       ├── auth.ts       # Auth configuration
│       ├── db.ts         # Prisma client
│       ├── redis.ts      # Redis client
│       └── sandbox/      # Code execution
└── public/               # Static assets
```

## API Endpoints

### User APIs
- `POST /api/execute` - Execute code
- `GET /api/next-question` - Get next adaptive question
- `GET /api/topics/[topicId]` - Get topic details
- `GET /api/questions/[questionId]` - Get question details

### Admin APIs
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/analytics` - Detailed analytics
- `GET /api/admin/questions` - List questions (CRUD)
- `GET /api/admin/topics` - List topics
- `GET /api/admin/adaptive-debug` - Algorithm debug info
- `GET /api/admin/health` - System health check
- `PUT /api/admin/settings` - Update settings

## Testing

Run E2E tests:
```bash
npm run test:e2e
```

Run with UI:
```bash
npm run test:e2e:ui
```

View test report:
```bash
npm run test:e2e:report
```

## License

MIT
