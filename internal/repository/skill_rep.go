package repository

import (
	"database/sql"
	"skill-tracker/internal/models"
)

type SkillRepository struct {
	DB *sql.DB
}

func NewSkillRepository(db *sql.DB) *SkillRepository {
	return &SkillRepository{DB: db}
}

// CREATE skill
func (r *SkillRepository) Create(skill models.Skill) (models.Skill, error) {

	query := `
		INSERT INTO skills (
			user_id,
			nombre,
			categoria,
			prioridad
		)
		VALUES ($1, $2, $3, $4)
		RETURNING id, creado_en
	`

	err := r.DB.QueryRow(
		query,
		skill.UserID,
		skill.Nombre,
		skill.Categoria,
		skill.Prioridad,
	).Scan(
		&skill.ID,
		&skill.CreadoEn,
	)

	if err != nil {
		return models.Skill{}, err
	}

	return skill, nil
}

// GET ALL
func (r *SkillRepository) GetAll() ([]models.Skill, error) {

	query := `
		SELECT
			id,
			user_id,
			nombre,
			categoria,
			prioridad,
			estado,
			progreso,
			notas,
			ultima_practica,
			creado_en
		FROM skills
		ORDER BY id
	`

	rows, err := r.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var skills []models.Skill

	for rows.Next() {

		var skill models.Skill

		err := rows.Scan(
			&skill.ID,
			&skill.UserID,
			&skill.Nombre,
			&skill.Categoria,
			&skill.Prioridad,
			&skill.Estado,
			&skill.Progreso,
			&skill.Notas,
			&skill.UltimaPractica,
			&skill.CreadoEn,
		)

		if err != nil {
			return nil, err
		}

		skills = append(skills, skill)
	}

	return skills, nil
}

// GET BY ID
func (r *SkillRepository) GetByID(id int) (models.Skill, error) {

	query := `
		SELECT
			id,
			user_id,
			nombre,
			categoria,
			prioridad,
			estado,
			progreso,
			notas,
			ultima_practica,
			creado_en
		FROM skills
		WHERE id = $1
	`

	var skill models.Skill

	err := r.DB.QueryRow(query, id).Scan(
		&skill.ID,
		&skill.UserID,
		&skill.Nombre,
		&skill.Categoria,
		&skill.Prioridad,
		&skill.Estado,
		&skill.Progreso,
		&skill.Notas,
		&skill.UltimaPractica,
		&skill.CreadoEn,
	)

	if err != nil {
		return models.Skill{}, err
	}

	return skill, nil
}

// GET SKILLS DE UN USUARIO
func (r *SkillRepository) GetByUserID(userID int) ([]models.Skill, error) {

	query := `
		SELECT
			id,
			user_id,
			nombre,
			categoria,
			prioridad,
			estado,
			progreso,
			notas,
			ultima_practica,
			creado_en
		FROM skills
		WHERE user_id = $1
		ORDER BY id
	`

	rows, err := r.DB.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var skills []models.Skill

	for rows.Next() {

		var skill models.Skill

		err := rows.Scan(
			&skill.ID,
			&skill.UserID,
			&skill.Nombre,
			&skill.Categoria,
			&skill.Prioridad,
			&skill.Estado,
			&skill.Progreso,
			&skill.Notas,
			&skill.UltimaPractica,
			&skill.CreadoEn,
		)

		if err != nil {
			return nil, err
		}

		skills = append(skills, skill)
	}

	return skills, nil
}

// UPDATE
func (r *SkillRepository) Update(skill models.Skill) error {

	query := `
		UPDATE skills
		SET
			nombre = $1,
			categoria = $2,
			prioridad = $3,
			estado = $4,
			notas = $5
		WHERE id = $6
	`

	_, err := r.DB.Exec(
		query,
		skill.Nombre,
		skill.Categoria,
		skill.Prioridad,
		skill.Estado,
		skill.Notas,
		skill.ID,
	)

	return err
}

// DELETE
func (r *SkillRepository) Delete(id int) error {

	query := `
		DELETE FROM skills
		WHERE id = $1
	`

	_, err := r.DB.Exec(query, id)

	return err
}