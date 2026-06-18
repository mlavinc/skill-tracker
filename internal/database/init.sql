CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    color VARCHAR(20) DEFAULT '#6c8cff',
    creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(100) DEFAULT '',
    prioridad VARCHAR(20) DEFAULT 'Media',
    estado VARCHAR(20) DEFAULT 'Activo',
    notas TEXT DEFAULT '',
    ultima_practica DATE,
    creado_en TIMESTAMP DEFAULT NOW(),
    progreso INT DEFAULT 0 CHECK (progreso BETWEEN 0 AND 100)
);

CREATE TABLE IF NOT EXISTS sesiones_practica (
    id SERIAL PRIMARY KEY,
    skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
    fecha TIMESTAMP DEFAULT NOW(),
    duracion_minutos INT,
    notas TEXT DEFAULT '',
    progreso_percibido INT
);

-- Índices para acelerar las consultas más frecuentes
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON skills(user_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_skill_id ON sesiones_practica(skill_id);
