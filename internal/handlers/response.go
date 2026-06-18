package handlers

import (
	"encoding/json"
	"log"
	"net/http"
)

// respondJSON escribe una respuesta JSON con el status indicado.
func respondJSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	if payload == nil {
		return
	}

	if err := json.NewEncoder(w).Encode(payload); err != nil {
		log.Printf("error encoding JSON response: %v", err)
	}
}

// respondError loguea el error real internamente (para debugging) y devuelve
// al cliente únicamente un mensaje público genérico, sin filtrar detalles de
// Go o PostgreSQL.
func respondError(w http.ResponseWriter, status int, publicMessage string, internalErr error) {
	if internalErr != nil {
		log.Printf("[error] status=%d msg=%q: %v", status, publicMessage, internalErr)
	} else {
		log.Printf("[error] status=%d msg=%q", status, publicMessage)
	}

	respondJSON(w, status, map[string]string{"error": publicMessage})
}
