# Local Development Setup

This guide helps you run the application locally while keeping only the database in Docker.

## Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- Docker & Docker Compose

## Quick Start

### 1. Start Database Container

```bash
# Stop all containers (if any are running)
docker-compose down

# Start only the database and pgAdmin
docker-compose -f docker-compose.local.yml up -d
```

This will start:

- **PostgreSQL** on port `5432`
- **pgAdmin** on port `5050` (http://localhost:5050)

### 2. Configure Environment

Ensure your `.env` file has the correct settings:

```env
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# Database (localhost since we're connecting from host machine)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=matrimony_db
DB_SSL=false

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

### 3. Install Dependencies

```bash
yarn install
```

### 4. Run Application

```bash
# Development mode with hot-reload
yarn start:dev

# Production mode
yarn build
yarn start:prod
```

## Access Points

- **API**: http://localhost:3000/api/v1
- **Swagger Docs**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/v1/health
- **pgAdmin**: http://localhost:5050
  - Email: `admin@matrimony.local`
  - Password: `admin`

## Available Scripts

```bash
# Development
yarn start:dev          # Run in development mode with hot-reload
yarn start:debug        # Run in debug mode

# Production
yarn build             # Build the application
yarn start:prod        # Run in production mode

# Testing
yarn test              # Run unit tests
yarn test:e2e          # Run e2e tests
yarn test:cov          # Run tests with coverage

# Code Quality
yarn lint              # Run ESLint
yarn lint --fix        # Fix linting issues
yarn format            # Format code with Prettier
```

## Database Management

### Connect to PostgreSQL via pgAdmin

1. Open http://localhost:5050
2. Login with credentials above
3. Add new server:
   - **Name**: Matrimony Local
   - **Host**: `matrimony-postgres` (container name) or `host.docker.internal`
   - **Port**: `5432`
   - **Database**: `matrimony_db`
   - **Username**: `postgres`
   - **Password**: `postgres`

### Direct Database Connection

```bash
# Using psql
docker exec -it matrimony-postgres psql -U postgres -d matrimony_db

# Or connect from host machine
psql -h localhost -p 5432 -U postgres -d matrimony_db
```

## Stopping Services

```bash
# Stop the application
# Press Ctrl+C in the terminal running the app

# Stop database containers
docker-compose -f docker-compose.local.yml down

# Stop and remove volumes (WARNING: This deletes all data)
docker-compose -f docker-compose.local.yml down -v
```

## Troubleshooting

### Port Already in Use

If port 3000 or 5432 is already in use:

```bash
# Check what's using the port
lsof -i :3000
lsof -i :5432

# Kill the process
kill -9 <PID>
```

### Database Connection Issues

1. Ensure PostgreSQL container is running:

   ```bash
   docker ps
   ```

2. Check container logs:

   ```bash
   docker logs matrimony-postgres
   ```

3. Verify `.env` has `DB_HOST=localhost` (not `postgres`)

### TypeORM Synchronization

In development mode, TypeORM automatically creates/updates database tables based on your entities. To disable this, set `synchronize: false` in `src/config/database.config.ts`.

## Running Full Stack with Docker

If you want to run everything in Docker:

```bash
# Stop local database
docker-compose -f docker-compose.local.yml down

# Start full stack
docker-compose up -d --build
```
