FROM golang:1.23-alpine AS builder
WORKDIR /app
COPY . .
RUN go mod tidy
RUN go build -o main ./cmd/api

FROM alpine:3.19
WORKDIR /app
COPY --from=builder /app/main .
RUN chmod +x ./main
EXPOSE 8080
CMD ["./main"]