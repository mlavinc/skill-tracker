package repository

import (
	"database/sql"
	"skill-tracker/internal/models"
)

type SessionRepository struct {
	DB *sql.DB
}

func NewSessionRepository(db *sql.DB) *SessionRepository {
	return &SessionRepository{DB: db}
}

// CREATE session
func (r *SessionRepository) Create(session models.SessionPractice) (int, error) {

	var id int

	query := `
		INSERT INTO sesiones_practica (
			skill_id,
			duracion_minutos,
			notas,
			progreso_percibido
		)
		VALUES ($1, $2, $3, $4)
		RETURNING id
	`

	err := r.DB.QueryRow(
		query,
		session.SkillID,
		session.DuracionMinutos,
		session.Notas,
		session.ProgresoPercibido,
	).Scan(&id)

	if err != nil {
		return 0, err
	}

	err = r.UpdateSkillProgress(
		session.SkillID,
		session.ProgresoPercibido,
	)

	if err != nil {
		return 0, err
	}

	return id, nil
}

// UPDATE progreso y fecha última práctica
func (r *SessionRepository) UpdateSkillProgress(
	skillID int,
	progresoPercibido int,
) error {

	query := `
		UPDATE skills
		SET
			progreso = progreso + $1,
			ultima_practica = CURRENT_DATE
		WHERE id = $2
	`

	_, err := r.DB.Exec(
		query,
		progresoPercibido,
		skillID,
	)

	return err
}

// GET sesiones por skill
func (r *SessionRepository) GetBySkillID(skillID int) ([]models.SessionPractice, error) {

	query := `
		SELECT
			id,
			skill_id,
			fecha,
			duracion_minutos,
			notas,
			progreso_percibido
		FROM sesiones_practica
		WHERE skill_id = $1
		ORDER BY fecha DESC
	`

	rows, err := r.DB.Query(query, skillID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sessions []models.SessionPractice

	for rows.Next() {

		var s models.SessionPractice

		err := rows.Scan(
			&s.ID,
			&s.SkillID,
			&s.Fecha,
			&s.DuracionMinutos,
			&s.Notas,
			&s.ProgresoPercibido,
		)

		if err != nil {
			return nil, err
		}

		sessions = append(sessions, s)
	}

	return sessions, nil
}