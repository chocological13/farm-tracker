# backend/Dockerfile
FROM golang:1.23-alpine AS builder

# Install necessary build tools
RUN apk add --no-cache git

WORKDIR /app

# Copy only necessary files for go mod
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the code
COPY . .

# Build with optimizations
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /app/main ./cmd/api

# Use distroless for minimal image size
FROM gcr.io/distroless/static-debian11
WORKDIR /app
COPY --from=builder /app/main /main

EXPOSE 8080
CMD ["/main"]
