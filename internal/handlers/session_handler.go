package handlers
import (
	"encoding/json"
	"net/http"
	"skill-tracker/internal/models"
	"skill-tracker/internal/repository"
	"strconv"
	"strings"
)
type SessionHandler struct {
	Repo *repository.SessionRepository
}

func NewSessionHandler(repo *repository.SessionRepository) *SessionHandler {
	return &SessionHandler{Repo: repo}
}

// POST /skills/{id}/sesiones
func (h *SessionHandler) CreateSession(w http.ResponseWriter, r *http.Request) {

	// extraer skill_id desde URL manual routing
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 4 {
		http.Error(w, "invalid url", http.StatusBadRequest)
		return
	}

	skillID, err := strconv.Atoi(parts[2])
	if err != nil {
		http.Error(w, "invalid skill id", http.StatusBadRequest)
		return
	}

	var session models.SessionPractice

	err = json.NewDecoder(r.Body).Decode(&session)
	if err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	session.SkillID = skillID

	id, err := h.Repo.Create(session)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	session.ID = id

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(session)
}
func (h *SessionHandler) GetSessionsBySkill(w http.ResponseWriter, r *http.Request) {

	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 3 {
		http.Error(w, "invalid url", http.StatusBadRequest)
		return
	}

	skillID, err := strconv.Atoi(parts[2])
	if err != nil {
		http.Error(w, "invalid skill id", http.StatusBadRequest)
		return
	}

	sessions, err := h.Repo.GetBySkillID(skillID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(sessions)
}