package models
import "time"

type SessionPractice struct {
	ID int `json:"id"`
	SkillID int `json:"skill_id"`
	Fecha time.Time `json:"fecha"`
	DuracionMinutos int `json:"duracion_minutos"`
	Notas string `json:"notas"`
	ProgresoPercibido int `json:"progreso_percibido"`
}