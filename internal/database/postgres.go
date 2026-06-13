package database

import (
	"database/sql"
	"fmt"
	"os"
	"time"

	_ "github.com/lib/pq"
)

func Connect() (*sql.DB, error) {

	// 1. CLOUD MODE (preferred)
	dsn := os.Getenv("DATABASE_URL")

	// 2. LOCAL FALLBACK MODE
	if dsn == "" {
		host := getenv("DB_HOST", "localhost")
		port := getenv("DB_PORT", "5432")
		user := getenv("DB_USER", "postgres")
		password := getenv("DB_PASSWORD", "1234")
		dbname := getenv("DB_NAME", "skilltracker")

		dsn = fmt.Sprintf(
			"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
			host, port, user, password, dbname,
		)
	}

	var (
		db  *sql.DB
		err error
	)

	// 🔁 RETRY LOOP (LA PARTE IMPORTANTE)
	for i := 1; i <= 10; i++ {

		db, err = sql.Open("postgres", dsn)
		if err == nil {
			err = db.Ping()
			if err == nil {
				break
			}
		}

		fmt.Printf("⏳ DB not ready (attempt %d/10): %v\n", i, err)
		time.Sleep(2 * time.Second)
	}

	if err != nil {
		return nil, fmt.Errorf("❌ could not connect to database after retries: %w", err)
	}

	// Pool tuning (IMPORTANT for cloud)
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)

	fmt.Println("✅ Connected to PostgreSQL!")
	return db, nil
}

// helper
func getenv(key, fallback string) string {
	val := os.Getenv(key)
	if val == "" {
		return fallback
	}
	return val
}