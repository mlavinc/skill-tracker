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

	var skill models.Skill

	err := json.NewDecoder(r.Body).Decode(&skill)
	if err != nil {
		respondError(w, http.StatusBadRequest, "Cuerpo de la petición inválido", err)
		return
	}

	if strings.TrimSpace(skill.Nombre) == "" {
		respondError(w, http.StatusBadRequest, "El nombre es obligatorio", nil)
		return
	}

	createdSkill, err := h.Repo.Create(skill)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "No se pudo crear la skill", err)
		return
	}

	respondJSON(w, http.StatusCreated, createdSkill)
}

func (h *SkillHandler) GetSkills(w http.ResponseWriter, r *http.Request) {

	skills, err := h.Repo.GetAll()
	if err != nil {
		respondError(w, http.StatusInternalServerError, "No se pudieron obtener las skills", err)
		return
	}

	respondJSON(w, http.StatusOK, skills)
}

func (h *SkillHandler) GetSkillByID(w http.ResponseWriter, r *http.Request) {

	idStr := strings.TrimPrefix(r.URL.Path, "/skills/")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondError(w, http.StatusBadRequest, "ID de skill inválido", err)
		return
	}

	skill, err := h.Repo.GetByID(id)
	if err != nil {
		respondError(w, http.StatusNotFound, "Skill no encontrada", err)
		return
	}

	respondJSON(w, http.StatusOK, skill)
}

func (h *SkillHandler) UpdateSkill(w http.ResponseWriter, r *http.Request) {

	idStr := strings.TrimPrefix(r.URL.Path, "/skills/")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondError(w, http.StatusBadRequest, "ID de skill inválido", err)
		return
	}

	var skill models.Skill

	err = json.NewDecoder(r.Body).Decode(&skill)
	if err != nil {
		respondError(w, http.StatusBadRequest, "Cuerpo de la petición inválido", err)
		return
	}

	if strings.TrimSpace(skill.Nombre) == "" {
		respondError(w, http.StatusBadRequest, "El nombre es obligatorio", nil)
		return
	}

	skill.ID = id

	err = h.Repo.Update(skill)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "No se pudo actualizar la skill", err)
		return
	}

	respondJSON(w, http.StatusOK, skill)
}

func (h *SkillHandler) DeleteSkill(w http.ResponseWriter, r *http.Request) {

	idStr := strings.TrimPrefix(r.URL.Path, "/skills/")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondError(w, http.StatusBadRequest, "ID de skill inválido", err)
		return
	}

	err = h.Repo.Delete(id)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "No se pudo eliminar la skill", err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
