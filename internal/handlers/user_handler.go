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
	Repo *repository.UserRepository
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
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	id, err := h.Repo.Create(user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	user.ID = id

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// GET /users
func (h *UserHandler) GetUsers(w http.ResponseWriter, r *http.Request) {

	users, err := h.Repo.GetAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

// GET /users/{id}
func (h *UserHandler) GetUserByID(w http.ResponseWriter, r *http.Request) {

	idStr := strings.TrimPrefix(r.URL.Path, "/users/")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	user, err := h.Repo.GetByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if user == nil {
		http.Error(w, "user not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
func (h *UserHandler) GetUserSkills(
	w http.ResponseWriter,
	r *http.Request,
) {

	parts := strings.Split(r.URL.Path, "/")

	if len(parts) < 4 {
		http.Error(w, "invalid url", http.StatusBadRequest)
		return
	}

	userID, err := strconv.Atoi(parts[2])
	if err != nil {
		http.Error(w, "invalid user id", http.StatusBadRequest)
		return
	}

	skills, err := h.SkillRepo.GetByUserID(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(skills)
}
func (h *UserHandler) GetUserStats(
	w http.ResponseWriter,
	r *http.Request,
) {

	parts := strings.Split(r.URL.Path, "/")

	if len(parts) < 4 {
		http.Error(w, "invalid url", http.StatusBadRequest)
		return
	}

	userID, err := strconv.Atoi(parts[2])
	if err != nil {
		http.Error(w, "invalid user id", http.StatusBadRequest)
		return
	}

	stats, err := h.Repo.GetStats(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}
func (h *UserHandler) GetRanking(
	w http.ResponseWriter,
	r *http.Request,
) {

	ranking, err := h.Repo.GetRanking()
	if err != nil {
		http.Error(
			w,
			err.Error(),
			http.StatusInternalServerError,
		)
		return
	}

	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	json.NewEncoder(w).Encode(ranking)
}