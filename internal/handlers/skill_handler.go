package handlers

import (
	"encoding/json"
	"net/http"
	"skill-tracker/internal/models"
	"skill-tracker/internal/repository"
	"strconv"
	"strings"
)

type SkillHandler struct {
	Repo *repository.SkillRepository
}

func NewSkillHandler(repo *repository.SkillRepository) *SkillHandler {
	return &SkillHandler{Repo: repo}
}

// POST /skills
func (h *SkillHandler) CreateSkill(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	var skill models.Skill

	// Decode request body
	err := json.NewDecoder(r.Body).Decode(&skill)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Insert into DB and get complete skill (with ID + fecha)
	createdSkill, err := h.Repo.Create(skill)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(createdSkill)
}
func (h *SkillHandler) GetSkills(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	skills, err := h.Repo.GetAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(skills)
}
func (h *SkillHandler) GetSkillByID(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	idStr := strings.TrimPrefix(r.URL.Path, "/skills/")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "invalid skill id", http.StatusBadRequest)
		return
	}

	skill, err := h.Repo.GetByID(id)
	if err != nil {
		http.Error(w, "skill not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(skill)
}
func (h *SkillHandler) UpdateSkill(w http.ResponseWriter, r *http.Request) {

	idStr := strings.TrimPrefix(r.URL.Path, "/skills/")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "invalid skill id", http.StatusBadRequest)
		return
	}

	var skill models.Skill

	err = json.NewDecoder(r.Body).Decode(&skill)
	if err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	skill.ID = id

	err = h.Repo.Update(skill)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(skill)
}
func (h *SkillHandler) DeleteSkill(w http.ResponseWriter, r *http.Request) {

	idStr := strings.TrimPrefix(r.URL.Path, "/skills/")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "invalid skill id", http.StatusBadRequest)
		return
	}

	err = h.Repo.Delete(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}