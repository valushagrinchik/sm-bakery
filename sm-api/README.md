# San Martin API

NestJS-based microservices API for bakery management system.

## Quick Start

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.sample .env

# Start services (PostgreSQL, Redis, RabbitMQ)
pnpm docker

# Run database migrations
pnpm migration:up

# Start development server
pnpm start:dev
```

## API Documentation

Access Swagger docs at: `http://localhost:3000/api-doc`

## Architecture

- **Main API** - REST API gateway
- **Microservices** - Email, SMS, Notification, Catalog Parsing
- **Database** - PostgreSQL with Sequelize ORM
- **Cache** - Redis for session management
- **Queue** - RabbitMQ for inter-service communication

## Key Features

- JWT authentication with role-based access control
- Rate limiting and security headers
- Performance monitoring and caching
- Comprehensive health checks
- API versioning and documentation

## Environment Variables

Configure in `.env`:
- Database connection
- Redis connection  
- RabbitMQ connection
- JWT secrets
- External API keys

See `.env.sample` for complete configuration.