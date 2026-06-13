package models

type RankingEntry struct {
	UserID   int    `json:"user_id"`
	Nombre   string `json:"nombre"`
	Color    string `json:"color"`
	Puntos   int    `json:"puntos"`
	Posicion int    `json:"posicion"`
}