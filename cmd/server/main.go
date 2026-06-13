package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"

	"skill-tracker/internal/database"
	"skill-tracker/internal/handlers"
	"skill-tracker/internal/repository"
)

func healthHandler(w http.ResponseWriter, r *http.Request) {
	response := map[string]string{
		"status": "ok",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// 🌐 CORS simple (necesario para React)
func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

func main() {

	// load env already handled by postgres.go or godotenv (if you added it)

	db, err := database.Connect()
	if err != nil {
		log.Fatal(err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Conectado a PostgreSQL!")

	// Repositories
	skillRepo := repository.NewSkillRepository(db)
	sessionRepo := repository.NewSessionRepository(db)
	userRepo := repository.NewUserRepository(db)

	// Handlers
	skillHandler := handlers.NewSkillHandler(skillRepo)
	sessionHandler := handlers.NewSessionHandler(sessionRepo)

	userHandler := handlers.NewUserHandler(
		userRepo,
		skillRepo,
	)

	// Health
	http.HandleFunc("/health", enableCORS(healthHandler))

	// USERS
	http.HandleFunc("/users", enableCORS(func(w http.ResponseWriter, r *http.Request) {

		switch r.Method {

		case http.MethodPost:
			userHandler.CreateUser(w, r)

		case http.MethodGet:
			userHandler.GetUsers(w, r)

		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}))

	http.HandleFunc("/users/", enableCORS(func(w http.ResponseWriter, r *http.Request) {

		if strings.Contains(r.URL.Path, "/skills") {
			if r.Method == http.MethodGet {
				userHandler.GetUserSkills(w, r)
				return
			}
		}

		if strings.Contains(r.URL.Path, "/stats") {
			if r.Method == http.MethodGet {
				userHandler.GetUserStats(w, r)
				return
			}
		}

		if r.Method == http.MethodGet {
			userHandler.GetUserByID(w, r)
			return
		}

		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}))

	// RANKING
	http.HandleFunc("/ranking", enableCORS(func(w http.ResponseWriter, r *http.Request) {

		if r.Method == http.MethodGet {
			userHandler.GetRanking(w, r)
			return
		}

		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}))

	// SKILLS
	http.HandleFunc("/skills", enableCORS(func(w http.ResponseWriter, r *http.Request) {

		switch r.Method {

		case http.MethodPost:
			skillHandler.CreateSkill(w, r)

		case http.MethodGet:
			skillHandler.GetSkills(w, r)

		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}))

	// SKILL DETAIL + SESSIONS
	http.HandleFunc("/skills/", enableCORS(func(w http.ResponseWriter, r *http.Request) {

		if strings.Contains(r.URL.Path, "/sesiones") {

			if r.Method == http.MethodPost {
				sessionHandler.CreateSession(w, r)
				return
			}

			if r.Method == http.MethodGet {
				sessionHandler.GetSessionsBySkill(w, r)
				return
			}
		}

		if r.Method == http.MethodGet {
			skillHandler.GetSkillByID(w, r)
			return
		}

		if r.Method == http.MethodPut {
			skillHandler.UpdateSkill(w, r)
			return
		}

		if r.Method == http.MethodDelete {
			skillHandler.DeleteSkill(w, r)
			return
		}

		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}))

	// PORT (CLOUD FRIENDLY)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Println("Server running on port", port)

	log.Fatal(http.ListenAndServe(":"+port, nil))
} 