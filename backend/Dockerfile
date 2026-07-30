FROM golang:1.23 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# 🔥 CLAVE: build estático
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./cmd/server


FROM alpine:latest

WORKDIR /app

# CA certificates required for TLS to managed Postgres (e.g. Neon).
RUN apk add --no-cache ca-certificates \
    && update-ca-certificates

COPY --from=builder /app/server /app/server

RUN chmod +x /app/server

EXPOSE 8080

CMD ["/app/server"]
