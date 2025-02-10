package main

import (
	"context"
	"github.com/chocological13/farm-tracker/internal/api"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"log"
	"log/slog"
	"os"
)

func main() {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// logger
	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))

	// connect to db
	dbUrl := os.Getenv("DATABASE_URL")
	if dbUrl == "" {
		log.Fatal("DATABASE_URL environment variable not set")
	}

	dbpool, err := pgxpool.New(context.Background(), dbUrl)
	if err != nil {
		log.Fatal(err)
	}
	defer dbpool.Close()

	logger.Info("database connection pool established")

	api.StartServer(dbpool)
}
