package repository

import (
	"database/sql"
	"skill-tracker/internal/models"
)

type UserRepository struct {
	DB *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{DB: db}
}

// CREATE user
func (r *UserRepository) Create(user models.User) (int, error) {

	var id int

	query := `
		INSERT INTO users (
			nombre,
			color
		)
		VALUES ($1, $2)
		RETURNING id
	`

	err := r.DB.QueryRow(
		query,
		user.Nombre,
		user.Color,
	).Scan(&id)

	if err != nil {
		return 0, err
	}

	return id, nil
}

// GET all users
func (r *UserRepository) GetAll() ([]models.User, error) {

	query := `
		SELECT
			id,
			nombre,
			color,
			creado_en
		FROM users
		ORDER BY nombre
	`

	rows, err := r.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []models.User

	for rows.Next() {

		var user models.User

		err := rows.Scan(
			&user.ID,
			&user.Nombre,
			&user.Color,
			&user.CreadoEn,
		)

		if err != nil {
			return nil, err
		}

		users = append(users, user)
	}

	return users, nil
}

// GET user by ID
func (r *UserRepository) GetByID(id int) (*models.User, error) {

	query := `
		SELECT
			id,
			nombre,
			color,
			creado_en
		FROM users
		WHERE id = $1
	`

	var user models.User

	err := r.DB.QueryRow(
		query,
		id,
	).Scan(
		&user.ID,
		&user.Nombre,
		&user.Color,
		&user.CreadoEn,
	)

	if err != nil {

		if err == sql.ErrNoRows {
			return nil, nil
		}

		return nil, err
	}

	return &user, nil
}
func (r *UserRepository) GetStats(userID int) (*models.UserStats, error) {

	var stats models.UserStats

	err := r.DB.QueryRow(`
		SELECT
			COUNT(*) AS total_skills,
			COALESCE(ROUND(AVG(progreso)), 0)
		FROM skills
		WHERE user_id = $1
	`, userID).Scan(
		&stats.TotalSkills,
		&stats.ProgresoPromedio,
	)

	if err != nil {
		return nil, err
	}

	err = r.DB.QueryRow(`
		SELECT
			COUNT(*),
			COALESCE(SUM(sp.duracion_minutos), 0)
		FROM sesiones_practica sp
		INNER JOIN skills s
			ON sp.skill_id = s.id
		WHERE s.user_id = $1
	`, userID).Scan(
		&stats.TotalSesiones,
		&stats.TotalMinutos,
	)

	if err != nil {
		return nil, err
	}

	return &stats, nil
}
func (r *UserRepository) GetRanking() ([]models.RankingEntry, error) {

	query := `
		SELECT
			u.id,
			u.nombre,
			u.color,
			COALESCE(SUM(s.progreso), 0) AS puntos
		FROM users u
		LEFT JOIN skills s
			ON u.id = s.user_id
		GROUP BY
			u.id,
			u.nombre,
			u.color
		ORDER BY puntos DESC
	`

	rows, err := r.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ranking []models.RankingEntry

	posicion := 1

	for rows.Next() {

		var rnk models.RankingEntry

		err := rows.Scan(
			&rnk.UserID,
			&rnk.Nombre,
			&rnk.Color,
			&rnk.Puntos,
		)

		if err != nil {
			return nil, err
		}

		rnk.Posicion = posicion
		posicion++

		ranking = append(ranking, rnk)
	}

	return ranking, nil
}