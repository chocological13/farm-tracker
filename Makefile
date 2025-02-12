# Default target
all: build

# Build all containers
build:
	docker-compose build

# Run the application
run:
	docker-compose up

# Run in detached mode
run-detached:
	docker-compose up -d

# Stop the application
stop:
	docker-compose down

# Clean up containers and build cache
clean:
	docker-compose down --rmi all
	docker system prune -f

# Run tests
test:
	cd backend && go test ./...
	cd frontend && yarn test

# Show logs
logs:
	docker-compose logs -f

# Generate API documentation
docs:
	cd backend && swag init -g cmd/api/main.go

# Helper to rebuild and restart a specific service
rebuild:
	docker-compose build $(service)
	docker-compose up -d --no-deps $(service)

# Run on local
local/backend:
	cd backend && go run ./cmd/api

local/frontend:
	cd frontend && yarn run dev
