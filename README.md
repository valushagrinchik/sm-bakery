# San Martín Bakery

A full-stack bakery management system with separate frontend and backend applications.

## Projects

### 🖥️ Admin Panel ([`sm-admin`](./sm-admin))
Next.js-based admin dashboard for bakery management
- **Technology**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Features**: Admin interface, real-time updates, Google Maps integration
- **Development**: `pnpm dev`
- **Build**: `pnpm build`

### 🔌 API Backend ([`sm-api`](./sm-api))
NestJS-based REST API with microservices architecture
- **Technology**: NestJS, TypeScript, Sequelize, PostgreSQL
- **Services**: Main API, Email Service, SMS Service, Catalog Parsing Service, Notification Service
- **Development**: `pnpm start:dev`
- **Production**: `pnpm start:prod`

## Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Redis (for caching)
- Docker (optional)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sm-bakery
   ```

2. **Install dependencies**
   ```bash
   # Admin Panel
   cd sm-admin
   pnpm install
   
   # API Backend
   cd ../sm-api
   pnpm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env` in both projects
   - Configure database connections and API keys

4. **Database Setup**
   ```bash
   cd sm-api
   pnpm migration:up
   pnpm db:seed:run
   ```

5. **Start Development Servers**
   ```bash
   # Terminal 1 - API Backend
   cd sm-api
   pnpm start:dev
   
   # Terminal 2 - Admin Panel
   cd sm-admin
   pnpm dev
   ```

## Docker Support

Both projects include Docker configurations:

```bash
# Admin Panel
cd sm-admin
pnpm docker:dev

# API Backend
cd sm-api
pnpm docker
```

## Architecture

```
sm-bakery/
├── sm-admin/          # Next.js Admin Dashboard
├── sm-api/            # NestJS API Backend
│   ├── apps/
│   │   ├── san-martin-api/
│   │   ├── email-service/
│   │   ├── sms-service/
│   │   ├── catalog-parsing-service/
│   │   └── notification-service/
│   └── libs/
└── README.md          # This file
```

## Technologies Used

### Frontend (sm-admin)
- **Framework**: Next.js 15 with App Router
- **UI**: React 19, Tailwind CSS, Headless UI
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Maps**: Google Maps API
- **Real-time**: Socket.io Client

### Backend (sm-api)
- **Framework**: NestJS 10
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT
- **File Storage**: AWS S3
- **Email**: Brevo API
- **Caching**: Redis
- **Message Queue**: Bull Queue with Redis
- **WebSocket**: Socket.io
- **Documentation**: Swagger/OpenAPI

## License

Private project - All rights reserved.
