# Matrimony Backend API

A comprehensive NestJS backend application for a matrimony/matchmaking platform, built with Fastify, TypeORM, and PostgreSQL. Features include role-based authorization (CASL), complete user profile management, and Docker containerization.

## 🚀 Features

- **Fast & Scalable**: Built with NestJS and Fastify for high performance
- **Type-Safe**: Full TypeScript implementation with strict typing
- **Authorization**: CASL-based role management (Application User, Supervisor, Superadmin)
- **Database**: PostgreSQL with TypeORM and comprehensive entity relationships
- **Logging**: Pino logger with pretty printing in development
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Containerized**: Docker & Docker Compose for easy deployment
- **Clean Architecture**: Well-organized folder structure with separation of concerns

## 📋 Tech Stack

- **Framework**: NestJS v10.0.0
- **HTTP Server**: Fastify (high-performance alternative to Express)
- **Language**: TypeScript v5.1.3
- **Database**: PostgreSQL 16
- **ORM**: TypeORM v0.3.17
- **Package Manager**: Yarn
- **Logger**: Pino (nestjs-pino v3.5.0)
- **Documentation**: Swagger/OpenAPI v7.1.16
- **Authorization**: CASL v6.5.0
- **ID Generation**: ULID v2.3.0 (Universally Unique Lexicographically Sortable Identifier)

## 📁 Project Structure

```
matrimony-backend/
├── src/
│   ├── common/                      # Shared utilities and components
│   │   ├── database/
│   │   │   └── entities/           # TypeORM entities
│   │   │       ├── base.entity.ts           # Base entity with ULID & audit fields
│   │   │       ├── user.entity.ts           # User authentication
│   │   │       ├── user-profile.entity.ts   # User profile details
│   │   │       ├── contact-info.entity.ts   # Contact information
│   │   │       ├── education.entity.ts      # Education details
│   │   │       ├── users-family.entity.ts   # Family information
│   │   │       ├── religion-info.entity.ts  # Religious details
│   │   │       ├── patrika.entity.ts        # Horoscope/Patrika
│   │   │       ├── user-preferences.entity.ts      # User preferences
│   │   │       ├── profile-visited.entity.ts       # Profile visit tracking
│   │   │       └── user-blocked-profile.entity.ts  # Blocked users
│   │   ├── decorators/             # Custom decorators
│   │   ├── dto/                    # Common DTOs
│   │   ├── enums/                  # Enumerations
│   │   │   ├── role.enum.ts        # User roles
│   │   │   ├── action.enum.ts      # CASL actions
│   │   │   ├── marital-status.enum.ts
│   │   │   ├── mother-tongue.enum.ts
│   │   │   ├── blood-group.enum.ts
│   │   │   └── complexion.enum.ts
│   │   ├── filters/                # Exception filters
│   │   ├── guards/                 # Authentication guards
│   │   ├── interceptors/           # Request/Response interceptors
│   │   ├── interfaces/             # Shared interfaces
│   │   ├── middleware/             # Custom middleware
│   │   ├── modules/                # Common/shared modules
│   │   │   └── casl/              # CASL authorization module
│   │   │       ├── casl-ability.factory.ts  # Permission definitions
│   │   │       ├── casl.module.ts           # CASL module
│   │   │       ├── policies.decorator.ts    # @CheckPolicies decorator
│   │   │       ├── policies.guard.ts        # Authorization guard
│   │   │       └── README.md               # CASL usage guide
│   │   └── pipes/                  # Validation pipes
│   ├── config/                     # Configuration files
│   │   ├── database.config.ts      # Database configuration
│   │   └── logger.config.ts        # Pino logger configuration
│   ├── modules/                    # Feature modules (business logic)
│   ├── app.controller.ts
│   ├── app.module.ts              # Root module
│   ├── app.service.ts
│   └── main.ts                    # Application entry point
├── test/                          # E2E tests
├── docker-compose.yml             # Development environment
├── docker-compose.prod.yml        # Production environment
├── Dockerfile                     # Multi-stage Docker build
├── .dockerignore
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── .eslintrc.js                  # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── nest-cli.json                 # NestJS CLI config
├── tsconfig.json                 # TypeScript config
├── tsconfig.build.json
└── package.json
```

## 🎯 Database Schema

The application uses 10 interconnected entities with ULID-based primary keys and audit fields:

### Core Entities
- **User**: Authentication and role management
- **UserProfile**: Personal details, physical attributes, lifestyle
- **ContactInfo**: Phone, email, address information
- **Education**: Academic qualifications (one-to-many)
- **UsersFamily**: Family member details (one-to-many)
- **ReligionInfo**: Religion, caste, horoscope details
- **Patrika**: Birth details and horoscope information
- **UserPreferences**: Partner preferences and search criteria
- **ProfileVisited**: Track profile views
- **UserBlockedProfile**: Manage blocked users

### Base Entity Features
All entities extend `BaseEntity` with:
- `id`: 26-character ULID (sortable, unique identifier)
- `createdBy`: Creator tracking
- `createdAt`: Auto-generated timestamp
- `updatedBy`: Last modifier tracking
- `updatedAt`: Auto-updated timestamp

## 🔐 Authorization (CASL)

Three role levels with granular permissions:

### Roles
1. **APPLICATION_USER** (Default)
   - Manage own profile and data
   - View other users' public profiles
   - Create profile visits and block users
   - Cannot access sensitive data of others

2. **SUPERVISOR**
   - All user permissions
   - Read all user profiles
   - Moderate content and manage reports
   - Update user verification status
   - Cannot delete users or sensitive data

3. **SUPERADMIN**
   - Full system access
   - All CRUD operations on all entities
   - User management and system configuration

See `src/common/modules/casl/README.md` for detailed usage.

## 🛠️ Installation

```bash
# Install dependencies
yarn install
```

## 🚢 Running the Application

### Option 1: Local Development (Without Docker)

1. Make sure PostgreSQL is installed and running
2. Copy `.env.example` to `.env` and configure database credentials
3. Run the application:

```bash
# Development with hot-reload
yarn start:dev

# Production mode
yarn start:prod

# Debug mode
yarn start:debug
```

### Option 2: Docker Development (Recommended)

The easiest way to get started with all services:

```bash
# Start all services (PostgreSQL + NestJS App + pgAdmin)
yarn docker:dev

# Or start with rebuild
yarn docker:dev:build

# Stop all services
yarn docker:dev:down
```

**Services Available:**
- **API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api/docs
- **pgAdmin**: http://localhost:5050
  - Email: `admin@admin.com`
  - Password: `admin`
- **PostgreSQL**: localhost:5432

### Option 3: Docker Production

```bash
# Start production environment
yarn docker:prod

# Start with rebuild
yarn docker:prod:build

# Stop production services
yarn docker:prod:down
```

## 🧪 Testing

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov

# Watch mode
yarn test:watch
```

## 🔧 Scripts

```bash
# Development
yarn start:dev          # Start with hot-reload
yarn start:debug        # Start in debug mode

# Build
yarn build              # Build for production

# Code Quality
yarn lint               # Lint and fix code
yarn format             # Format code with Prettier

# Docker
yarn docker:dev         # Start development containers
yarn docker:dev:build   # Rebuild and start development
yarn docker:dev:down    # Stop development containers
yarn docker:prod        # Start production containers
yarn docker:prod:build  # Rebuild and start production
yarn docker:prod:down   # Stop production containers
```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# Application
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=matrimony_db

# For Docker, use service name as host
# DB_HOST=postgres

# Optional
DB_SSL=false
DB_LOGGING=true
DB_SYNCHRONIZE=true  # Set to false in production!
```

## 🏗️ Architecture Highlights

### TypeScript Path Aliases
Clean imports using path mapping:
```typescript
import { User } from '@/common/database/entities';
import { Role } from '@/common/enums';
import { DatabaseConfig } from '@config/database.config';
```

### Multi-Stage Docker Build
- **Development**: Hot-reload with volume mounts
- **Build**: Optimized compilation
- **Production**: Minimal image with only dependencies

### Audit Trail
Every entity automatically tracks:
- Who created it (`createdBy`)
- When it was created (`createdAt`)
- Who last updated it (`updatedBy`)
- When it was last updated (`updatedAt`)

### ULID vs UUID
Uses ULID for better performance:
- Lexicographically sortable
- Timestamp embedded
- More compact than UUID
- Case-insensitive
- URL-safe

## 📚 API Documentation

Once the application is running, visit:

**Swagger UI**: http://localhost:3000/api/docs

The API is automatically documented with:
- All endpoints and methods
- Request/Response schemas
- Authentication requirements
- Example payloads

## 🗄️ Database Management

### Using pgAdmin (Docker)

1. Access pgAdmin at http://localhost:5050
2. Login with:
   - Email: `admin@admin.com`
   - Password: `admin`
3. Add server:
   - Host: `postgres`
   - Port: `5432`
   - Database: `matrimony_db`
   - Username: `postgres`
   - Password: `postgres`

### Direct Connection

```bash
# Using psql
psql -h localhost -p 5432 -U postgres -d matrimony_db

# Or use any PostgreSQL client
Host: localhost
Port: 5432
Database: matrimony_db
Username: postgres
Password: postgres
```

## 📂 Adding New Modules

1. Create module in `src/modules/`:
```bash
nest g module modules/your-module
nest g controller modules/your-module
nest g service modules/your-module
```

2. Import CASL if authorization is needed:
```typescript
import { CaslModule } from '@/common/modules/casl';

@Module({
  imports: [CaslModule],
  // ...
})
```

3. Add authorization to routes:
```typescript
import { CheckPolicies } from '@/common/modules/casl';
import { Action } from '@/common/enums';

@Get()
@CheckPolicies((ability) => ability.can(Action.READ, YourEntity))
findAll() {
  // ...
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is [UNLICENSED](LICENSE).

## 👥 Support

For issues and questions:
- Create an issue in the repository
- Contact the development team

## 🎯 Roadmap

- [ ] Implement authentication (JWT/Passport)
- [ ] Add email/SMS notifications
- [ ] Implement file upload for profile pictures
- [ ] Add search and filtering for profiles
- [ ] Implement matchmaking algorithm
- [ ] Add real-time chat functionality
- [ ] Create admin dashboard
- [ ] Add payment gateway integration
- [ ] Implement Redis for caching
- [ ] Add rate limiting and security middleware

## ⚡ Performance Tips

1. **Database Indexing**: Add indexes to frequently queried columns
2. **Caching**: Consider Redis for session and query caching
3. **Connection Pooling**: TypeORM connection pool is configured
4. **Logging**: Disable verbose logging in production
5. **Environment**: Set `DB_SYNCHRONIZE=false` in production

## 🔒 Security Considerations

- Never commit `.env` file to version control
- Use strong passwords for database and services
- Implement rate limiting for API endpoints
- Enable CORS only for trusted domains in production
- Use HTTPS in production
- Regularly update dependencies
- Implement proper input validation
- Use parameterized queries (TypeORM does this by default)

---

**Built with ❤️ using NestJS and TypeScript**
yarn docker:prod

# Start with rebuild
yarn docker:prod:build

# Stop all services
yarn docker:prod:down
```

## Testing

```bash
# unit tests
yarn test

# e2e tests
yarn test:e2e

# test coverage
yarn test:cov
```

## Linting

```bash
# run eslint
yarn lint

# format code
yarn format
```

## Docker Services

### Development (`docker-compose.yml`)
- **PostgreSQL** - Port 5432
- **App** - Port 3000 (hot-reload enabled)
- **pgAdmin** - Port 5050 (Database UI)
  - Email: admin@matrimony.com
  - Password: admin

### Production (`docker-compose.prod.yml`)
- **PostgreSQL** - Port 5432
- **App** - Port 3000 (optimized build)

## API Endpoints

- `GET /api/v1/` - Welcome message
- `GET /api/v1/health` - Health check endpoint
- `GET /api/docs` - Swagger documentation

## Environment Variables

Create a `.env` file in the root directory:

```env
# Application
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=matrimony_db
DB_SSL=false
```

## Database

The application uses PostgreSQL with TypeORM. Entities are located in `src/common/database/entities/`.

Tables:
- users
- user_profile
- contact_info
- education
- users_family
- religion_info
- patrika
- user_preferences
- profile_visited
- user_blocked_profile

## Accessing Services

- **API**: http://localhost:3000/api/v1
- **Swagger Docs**: http://localhost:3000/api/docs
- **pgAdmin**: http://localhost:5050

