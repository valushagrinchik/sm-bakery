# San Martin API

A NestJS-based microservices application with multiple services including email, SMS, notification, and catalog parsing.

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL
- Redis
- RabbitMQ

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.sample .env
   ```
   Edit the `.env` file with your configuration values.

3. **Start required services with Docker**
   ```bash
   npm run docker
   ```
   This will start:
   - PostgreSQL (port 5434)
   - Redis (port 6380)
   - RabbitMQ (ports 5672, 15672)

## Database Setup

1. **Run database migrations**
   ```bash
   npm run migration:up
   ```

2. **Seed the database (optional)**
   ```bash
   npm run db:seed:run
   ```

## Running the Application

### Development Mode

**Main API:**
```bash
npm run start:dev
```

**Individual Services:**
```bash
# Email Service
npm run email-service:start:dev

# SMS Service
npm run sms-service:start:dev

# Notification Service
npm run notification-service:start:dev

# Catalog Parsing Service
npm run catalog-parsing-service:start:dev
```

### Production Mode

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Run in production**
   ```bash
   # Main API
   npm run start:prod

   # Individual Services
   npm run email-service:start:prod
   npm run sms-service:start:prod
   npm run notification-service:start:prod
   npm run catalog-parsing-service:start:prod
   ```

## Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the main API
- `npm run start:dev` - Start in development mode with watch
- `npm run start:debug` - Start in debug mode
- `npm run lint` - Run ESLint and fix issues
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run test:e2e` - Run e2e tests

## Database Commands

- `npm run migration:create --name <migration_name>` - Create a new migration
- `npm run migration:up` - Run pending migrations
- `npm run migration:down` - Rollback last migration
- `npm run db:seed:create --name <seed_name>` - Create a new seed
- `npm run db:seed:run` - Run all seeds
- `npm run db:seed:undo` - Undo all seeds

## Docker Commands

- `npm run docker` - Start local development environment
- `npm run docker:test` - Start test environment and run tests

## Architecture

This is a microservices application with the following services:

- **san-martin-api** - Main API gateway
- **email-service** - Email handling service
- **sms-service** - SMS handling service
- **notification-service** - Notification management service
- **catalog-parsing-service** - Catalog parsing service

Each service can be run independently and communicates through message queues (RabbitMQ) and shared databases.

## API Documentation

Once the main API is running, you can access the Swagger documentation at:
```
http://localhost:3000/api
```

## Environment Variables

Key environment variables to configure in your `.env` file:

- Database connection settings
- Redis connection settings
- RabbitMQ connection settings
- JWT secrets
- External API keys (email, SMS, etc.)

Refer to `.env.sample` for a complete list of required variables.