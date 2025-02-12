# Farm Dashboard

A dashboard application with a Go backend and Next.js frontend for managing and visualizing packing records.

## Prerequisites

- Docker and Docker Compose
- Go 1.23
- Node.js and Yarn
- PostgreSQL (for local development)

## Environment Setup

The project uses several environment files placed in specific locations:

### Project Root Directory
Main environment file for Docker Compose and overall project configuration:
```env
# .env (in project root)
DATABASE_URL=postgres://[username]:[password]@[host]/[database]?sslmode=require
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Backend Environment
Place these files in the `backend` directory:
```env
# backend/.env
DATABASE_URL=postgresql://[username]:[password]@[host]/[database]?sslmode=require
GOOSE_DRIVER=postgres
GOOSE_DBSTRING=[your-connection-string]
GOOSE_MIGRATION_DIR=./db/migrations
```

### Frontend Environment
Place these files in the `frontend` directory:
```env
# frontend/.env.local
NEXT_PUBLIC_API_BASE_URL=localhost:8080
PORT=3000
```

⚠️ Note: Replace the placeholder values with your actual database credentials.

## Available Commands

### Development

```bash
# Build all containers
make build

# Run the application
make run

# Run in detached mode
make run-detached

# Stop the application
make stop

# Clean up containers and build cache
make clean
```

### Testing and Documentation

```bash
# Run tests
make test

# Generate API documentation
make docs

# View application logs
make logs
```

### Local Development

```bash
# Run backend locally
make local/backend

# Run frontend locally
make local/frontend
```

### Service Management

```bash
# Rebuild and restart a specific service
make rebuild service=backend  # or frontend
```

## API Documentation

### Base Record Operations

#### GET /api/v1/records
Retrieves packing records.
- Query parameters:
    - `time_begin`: Start timestamp (e.g., `2024-02-12T00:00:00Z`)
    - `time_end`: End timestamp (e.g., `2024-02-12T23:59:59Z`)
    - `limit`: Maximum number of records to return
    - `offset`: Number of records to skip for pagination
- Returns: JSON array of packing records

#### POST /api/v1/records
Creates a new packing record.
- Request body: JSON object representing the packing record
- Returns: Created packing record (201) or error (400)

### Metrics Endpoints

#### PIC Metrics
- `GET /api/v1/records/metrics/pic/hourly`: Hourly PIC metrics
- `GET /api/v1/records/metrics/pic/productivity/hourly`: Hourly productivity metrics
- `GET /api/v1/records/metrics/pic/productivity/daily`: Daily productivity metrics

#### Pack Metrics
- `GET /api/v1/records/metrics/packs/hourly`: Hourly pack data
- `GET /api/v1/records/metrics/packs/distribution/hourly`: Hourly pack distribution
- `GET /api/v1/records/metrics/packs/distribution/daily`: Daily pack distribution

#### Reject Metrics
- `GET /api/v1/records/metrics/rejects/hourly`: Hourly reject ratios
- `GET /api/v1/records/metrics/rejects/daily`: Daily reject ratios

Note: All metrics endpoints support the same query parameters as the base records endpoint:
- `time_begin`: Start timestamp
- `time_end`: End timestamp
- `limit`: Maximum number of records
- `offset`: Pagination offset

## API Collection

The complete API collection is available on Postman:
[Dashboard Endpoints Collection](https://www.postman.com/lunar-capsule-937835/workspace/dashboard-endpoints/request/34907322-d2c58831-09a6-4fb9-aaf5-35a171fd64cf)

## Docker Configuration

The project uses Docker Compose with two main services:

### Backend Service
- Port: 8080
- Environment: Uses `.env` file
- Volume mounting for live development

### Frontend Service
- Port: 3000
- Environment: Uses `.env` file
- Volume mounting for live development

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request