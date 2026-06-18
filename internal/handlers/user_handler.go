package handlers

import (
	"encoding/json"
	"net/http"
	"skill-tracker/internal/models"
	"skill-tracker/internal/repository"
	"strconv"
	"strings"
)

type UserHandler struct {
	Repo      *repository.UserRepository
	SkillRepo *repository.SkillRepository
}

func NewUserHandler(
	repo *repository.UserRepository,
	skillRepo *repository.SkillRepository,
) *UserHandler {

	return &UserHandler{
		Repo:      repo,
		SkillRepo: skillRepo,
	}
}

// POST /users
func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {

	var user models.User

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		respondError(w, http.StatusBadRequest, "Cuerpo de la petición inválido", err)
		return
	}

	if strings.TrimSpace(user.Nombre) == "" {
		respondError(w, http.StatusBadRequest, "El nombre es obligatorio", nil)
		return
	}

	id, err := h.Repo.Create(user)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "No se pudo crear el usuario", err)
		return
	}

	user.ID = id

	respondJSON(w, http.StatusCreated, user)
}

// GET /users
func (h *UserHandler) GetUsers(w http.ResponseWriter, r *http.Request) {

	users, err := h.Repo.GetAll()
	if err != nil {
		respondError(w, http.StatusInternalServerError, "No se pudieron obtener los usuarios", err)
		return
	}

	respondJSON(w, http.StatusOK, users)
}

// GET /users/{id}
func (h *UserHandler) GetUserByID(w http.ResponseWriter, r *http.Request) {

	idStr := strings.TrimPrefix(r.URL.Path, "/users/")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondError(w, http.StatusBadRequest, "ID de usuario inválido", err)
		return
	}

	user, err := h.Repo.GetByID(id)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "No se pudo obtener el usuario", err)
		return
	}

	if user == nil {
		respondError(w, http.StatusNotFound, "Usuario no encontrado", nil)
		return
	}

	respondJSON(w, http.StatusOK, user)
}

func (h *UserHandler) GetUserSkills(w http.ResponseWriter, r *http.Request) {

	parts := strings.Split(r.URL.Path, "/")

	if len(parts) < 4 {
		respondError(w, http.StatusBadRequest, "URL inválida", nil)
		return
	}

	userID, err := strconv.Atoi(parts[2])
	if err != nil {
		respondError(w, http.StatusBadRequest, "ID de usuario inválido", err)
		return
	}

	skills, err := h.SkillRepo.GetByUserID(userID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "No se pudieron obtener las skills del usuario", err)
		return
	}

	respondJSON(w, http.StatusOK, skills)
}

func (h *UserHandler) GetUserStats(w http.ResponseWriter, r *http.Request) {

	parts := strings.Split(r.URL.Path, "/")

	if len(parts) < 4 {
		respondError(w, http.StatusBadRequest, "URL inválida", nil)
		return
	}

	userID, err := strconv.Atoi(parts[2])
	if err != nil {
		respondError(w, http.StatusBadRequest, "ID de usuario inválido", err)
		return
	}

	stats, err := h.Repo.GetStats(userID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "No se pudieron obtener las estadísticas", err)
		return
	}

	respondJSON(w, http.StatusOK, stats)
}

func (h *UserHandler) GetRanking(w http.ResponseWriter, r *http.Request) {

	ranking, err := h.Repo.GetRanking()
	if err != nil {
		respondError(w, http.StatusInternalServerError, "No se pudo obtener el ranking", err)
		return
	}

	respondJSON(w, http.StatusOK, ranking)
}
