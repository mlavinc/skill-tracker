CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    color VARCHAR(20),
    creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(100),
    prioridad VARCHAR(20),
    estado VARCHAR(20),
    notas TEXT,
    ultima_practica DATE,
    creado_en TIMESTAMP DEFAULT NOW(),
    progreso INT DEFAULT 0
);

CREATE TABLE sesiones_practica (
    id SERIAL PRIMARY KEY,
    skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
    fecha TIMESTAMP,
    duracion_minutos INT,
    notas TEXT,
    progreso_percibido INT
);