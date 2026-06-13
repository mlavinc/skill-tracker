package models

import "time"

type Skill struct {
	ID             int         `json:"id"`
	UserID         int         `json:"user_id"`
	Nombre         string      `json:"nombre"`
	Categoria      string      `json:"categoria"`
	Prioridad      string      `json:"prioridad"`
	Estado         string      `json:"estado"`
	Progreso       int         `json:"progreso"`
	Notas          string      `json:"notas"`
	UltimaPractica *time.Time  `json:"ultima_practica"`
	CreadoEn       time.Time   `json:"creado_en"`
}