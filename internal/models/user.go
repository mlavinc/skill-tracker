package models

import "time"

type User struct {
	ID        int       `json:"id"`
	Nombre    string    `json:"nombre"`
	Color     string    `json:"color"`
	CreadoEn  time.Time `json:"creado_en"`
}