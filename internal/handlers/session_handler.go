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
		respondError(w, http.StatusBadRequest, "URL inválida", nil)
		return
	}

	skillID, err := strconv.Atoi(parts[2])
	if err != nil {
		respondError(w, http.StatusBadRequest, "ID de skill inválido", err)
		return
	}

	var session models.SessionPractice

	err = json.NewDecoder(r.Body).Decode(&session)
	if err != nil {
		respondError(w, http.StatusBadRequest, "Cuerpo de la petición inválido", err)
		return
	}

	if session.DuracionMinutos <= 0 {
		respondError(w, http.StatusBadRequest, "La duración debe ser mayor a 0 minutos", nil)
		return
	}

	if session.ProgresoPercibido < 0 || session.ProgresoPercibido > 100 {
		respondError(w, http.StatusBadRequest, "El progreso percibido debe estar entre 0 y 100", nil)
		return
	}

	session.SkillID = skillID

	id, err := h.Repo.Create(session)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "No se pudo registrar la sesión", err)
		return
	}

	session.ID = id

	respondJSON(w, http.StatusCreated, session)
}

func (h *SessionHandler) GetSessionsBySkill(w http.ResponseWriter, r *http.Request) {

	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 3 {
		respondError(w, http.StatusBadRequest, "URL inválida", nil)
		return
	}

	skillID, err := strconv.Atoi(parts[2])
	if err != nil {
		respondError(w, http.StatusBadRequest, "ID de skill inválido", err)
		return
	}

	sessions, err := h.Repo.GetBySkillID(skillID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "No se pudieron obtener las sesiones", err)
		return
	}

	respondJSON(w, http.StatusOK, sessions)
}
