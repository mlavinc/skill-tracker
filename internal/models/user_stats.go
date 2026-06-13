package models

type UserStats struct {
	TotalSkills      int `json:"total_skills"`
	TotalSesiones    int `json:"total_sesiones"`
	TotalMinutos     int `json:"total_minutos"`
	ProgresoPromedio int `json:"progreso_promedio"`
}