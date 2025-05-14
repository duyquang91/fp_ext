# 🚀 Food Panda Helper APIs

## 🌟 Introduction

Welcome to the Food Panda Killer Extension API – a dedicated backend service for the internal OKX staff food ordering system. Built on a streamlined, efficient, and scalable Express.js and TypeScript foundation, this API provides all the necessary endpoints to power the Food Panda Killer application.

## 💡 Motivation and Intentions

Developed to streamline backend development, this boilerplate is your solution for:

- ✨ Reducing setup time for new projects.
- 📊 Ensuring code consistency and quality.
- ⚡ Facilitating rapid development with cutting-edge tools.
- 🛡️ Encouraging best practices in security, testing, and performance.

## 🚀 Features

- 📁 Modular Structure: Organized by feature for easy navigation and scalability.
- 💨 Faster Execution with tsx: Rapid TypeScript execution with esbuild, complemented by tsc for type checking.
- 🌐 Stable Node Environment: Latest LTS Node version in .nvmrc.
- 🔧 Simplified Environment Variables with Envalid: Centralized and easy-to-manage configuration.
- 🔗 Path Aliases: Cleaner code with shortcut imports.
- 🔄 Dependabot Integration: Automatic updates for secure and up-to-date dependencies.
- 🔒 Security: Helmet for HTTP header security and CORS setup.
- 📊 Logging: Efficient logging with pino-http.
- 🧪 Comprehensive Testing: Robust setup with Vitest and Supertest.
- 🔑 Code Quality Assurance: Husky and lint-staged for consistent quality.
- ✅ Unified Code Style: ESLint and Prettier for a consistent coding standard.
- 📃 API Response Standardization: ServiceResponse class for consistent API responses.
- 🐳 Docker Support: Ready for containerization and deployment.
- 📝 Input Validation with Zod: Strongly typed request validation using Zod.
- 🧩 API Spec Generation: Automated OpenAPI specification generation from Zod schemas.
- 📄 Cookie Parsing: Advanced cookie parsing utilities for authentication flows.
- 🗄️ MongoDB Integration: Built-in MongoDB connectivity for data persistence.
- 🚫 Rate Limiting: Protection against abuse with express-rate-limit.

## 🛠️ Getting Started

### Step 1: 🚀 Initial Setup

- Clone the repository: `git clone https://github.com/your-org/fp_ext.git`
- Navigate: `cd fp_ext`
- Install dependencies: `npm ci`

### Step 2: ⚙️ Environment Configuration

- Create `.env`: Copy `.env.template` to `.env`
- Update `.env` with the following required variables:
  ```
  NODE_ENV="development"
  HOST="localhost"
  PORT=3000
  CORS_ORIGIN="http://localhost:3000"
  COMMON_RATE_LIMIT_MAX_REQUESTS=1000
  COMMON_RATE_LIMIT_WINDOW_MS=1000
  DB_CONNECTION_URI="your_mongodb_connection_string"
  DB_NAME="your_database_name"
  ```

### Step 3: 🏃‍♂️ Running the Project

- Development Mode: `npm run dev`
- Building: `npm run build`
- Production Mode: Set `.env` to `NODE_ENV="production"` then `npm run build && npm run start`
- Testing: `npm run test` or `npm run test:dev` for watch mode

## 📡 API Endpoints

The API provides the following endpoints:

- **Health Check**: `/fp/health-check`

  - GET: Check API status and MongoDB connectivity

- **User Management**: `/fp/users`

  - Various user management endpoints

- **API Documentation**:
  - OpenAPI documentation generated from Zod schemas

The API follows a standard response format using the `ServiceResponse` class:

```typescript
{
  success: boolean,
  message: string,
  data: T,
  statusCode: number
}
```

## 📁 Project Structure

```
.
├── src
│   ├── api
│   │   ├── healthCheck
│   │   │   ├── __tests__
│   │   │   │   └── healthCheckRouter.test.ts
│   │   │   └── healthCheckRouter.ts
│   │   └── user
│   │       ├── __tests__
│   │       │   ├── userModel.test.ts
│   │       │   ├── userRouter.test.ts
│   │       │   └── userService.test.ts
│   │       ├── userModel.ts
│   │       ├── userRepository.ts
│   │       ├── userRouter.ts
│   │       └── userService.ts
│   ├── api-docs
│   │   ├── __tests__
│   │   │   └── openAPIRouter.test.ts
│   │   ├── openAPIDocumentGenerator.ts
│   │   ├── openAPIResponseBuilders.ts
│   │   └── openAPIRouter.ts
│   ├── common
│   │   ├── __tests__
│   │   │   ├── cookieParsed.test.ts
│   │   │   ├── errorHandler.test.ts
│   │   │   └── requestLogger.test.ts
│   │   ├── middleware
│   │   │   ├── errorHandler.ts
│   │   │   ├── mongoDBquery.ts
│   │   │   ├── rateLimiter.ts
│   │   │   └── requestLogger.ts
│   │   ├── models
│   │   │   └── serviceResponse.ts
│   │   └── utils
│   │       ├── commonValidation.ts
│   │       ├── cookiePaser.ts
│   │       ├── envConfig.ts
│   │       └── httpHandlers.ts
│   ├── index.ts
│   └── server.ts
├── Dockerfile
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── vite.config.mts
```

## 🤝 Feedback and Contributions

We'd love to hear your feedback and suggestions for further improvements. Feel free to contribute and join us in making backend development cleaner and faster!

## 🗄️ MongoDB Integration

This API uses MongoDB for data persistence. The integration is implemented in `src/common/middleware/mongoDBquery.ts` and provides two main functions:

### Connection Testing

```typescript
// Test database connection
const dbStatus = await testConnection()
```

### Query Execution

```typescript
// Execute a query against a specific collection
const results = await mongoDBquery<YourType>(
  'collectionName',
  { field: 'value' } // MongoDB query
)
```

### MongoDB Configuration

Add your MongoDB connection string to the `.env` file:

```
DB_CONNECTION_URI="mongodb://username:password@host:port/database"
DB_NAME="your_database_name"
```

## 📚 API Documentation

### OpenAPI Integration

The API documentation is automatically generated from Zod schemas using the `@asteasolutions/zod-to-openapi` package. The OpenAPI specification is created in `src/api-docs/openAPIDocumentGenerator.ts`:

```typescript
export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([healthCheckRegistry, userRegistry])
  const generator = new OpenApiGeneratorV3(registry.definitions)

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: 'beta',
      title: '🐼 Food Panda Helper APIs',
      description: "This service is using by OKX's staffs internally.",
    },
  })
}
```

### Defining API Routes

API endpoints are registered with OpenAPI using the registry pattern:

```typescript
// Example from a router file
const myRegistry = new OpenAPIRegistry()

myRegistry.registerPath({
  method: 'get',
  path: '/fp/my-endpoint',
  tags: ['My Feature'],
  responses: createApiResponse(myZodSchema, 'Success'),
})
```

### Viewing the Documentation

When the server is running, the OpenAPI documentation is available at the `/api-docs` endpoint.

## 💻 Development Guidelines

### Adding a New API Feature

1. **Create the Feature Folder**

   - Add a new folder under `src/api/[feature-name]/`

2. **Implement the Required Files**

   - `[feature]Model.ts`: Define the data model with Zod schemas
   - `[feature]Repository.ts`: Handle data access operations
   - `[feature]Service.ts`: Implement business logic
   - `[feature]Router.ts`: Define routes and link to service

3. **Register the OpenAPI Registry**

   - Add your feature's registry to `openAPIDocumentGenerator.ts`

4. **Add Routes to Server**
   - Register your router in `server.ts`

### Testing Strategy

1. **Unit Tests**

   - Create tests in `__tests__` folders
   - Focus on individual function behavior

2. **Integration Tests**

   - Use Supertest for HTTP endpoint testing
   - Test the full request/response cycle

3. **Running Tests**
   - `npm run test`: Run all tests
   - `npm run test:dev`: Run tests in watch mode
   - `npm run test:cov`: Run tests with coverage report

## 🐳 Docker Deployment

This project includes Docker support for easy deployment and consistent environments.

### Building the Docker Image

```bash
docker build -t food-panda-helper-api .
```

### Running the Container

```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e HOST=0.0.0.0 \
  -e PORT=3000 \
  -e DB_CONNECTION_URI=your_connection_string \
  -e DB_NAME=your_db_name \
  -e CORS_ORIGIN=http://allowed-origin.com \
  food-panda-helper-api
```

### Docker Compose (for local development)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=development
      - HOST=0.0.0.0
      - PORT=3000
      - DB_CONNECTION_URI=mongodb://mongo:27017/food-panda
      - DB_NAME=food-panda
      - CORS_ORIGIN=http://localhost:3000
    depends_on:
      - mongo

  mongo:
    image: mongo:latest
    ports:
      - '27017:27017'
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

Run with:

```bash
docker-compose up
```

## 🔒 Security Best Practices

### HTTP Security Headers

This API uses Helmet.js to set secure HTTP headers:

```typescript
// From server.ts
app.use(helmet())
```

### Rate Limiting

API endpoints are protected against abuse using rate limiters:

```typescript
// From src/common/middleware/rateLimiter.ts
export default rateLimit({
  windowMs: env.COMMON_RATE_LIMIT_WINDOW_MS,
  max: env.COMMON_RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
})
```

### Input Validation

All incoming requests are validated using Zod schemas:

```typescript
// Example validation
const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  // more fields...
})

// In the router
router.post('/', validate(userSchema), controller.create)
```

### CORS Configuration

Cross-Origin Resource Sharing is configured in `server.ts`:

```typescript
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
)
```

## 🔄 CI/CD Pipeline

This project includes GitHub Actions workflows for continuous integration and deployment.

### Available Workflows

- **Build**: Validates that the application builds successfully
- **CodeQL**: Runs code quality and security analysis
- **Docker Image**: Builds and tests the Docker image
- **Release**: Automates the release process with semantic versioning

### Semantic Release

The project uses `semantic-release` for versioning and release management:

```json
// From release.config.cjs
{
  "branches": ["master"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/github",
    "@semantic-release/git"
  ]
}
```

### Commit Message Format

For proper versioning, follow the conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:

- `feat`: A new feature (minor release)
- `fix`: A bug fix (patch release)
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactorings
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Changes to the build process or tools

🎉 Happy coding!
