-- 🔹 Crear tabla de roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- Insertar roles por defecto
INSERT INTO roles (nombre) VALUES ('admin'), ('analista');

-- 🔹 Crear tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contrasena TEXT NOT NULL,
    role_id INT REFERENCES role(id) ON DELETE SET NULL,
    profile_picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔹 Crear tabla de jugadores
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    equipo VARCHAR(100) NOT NULL,
    nacionalidad VARCHAR(50) NOT NULL,
    profile_picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔹 Crear tabla de declaraciones manuales (Datos ingresados por analistas)
CREATE TABLE declarations (
    id SERIAL PRIMARY KEY,
    player_id INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    categoria_texto VARCHAR(50) NOT NULL, -- "Previo al partido", "Post-partido", "Durante entrenamiento", "Lesión"
    texto TEXT NOT NULL, -- Comentario o declaración del jugador
    fuente VARCHAR(100) NOT NULL, -- Ej: "ESPN", "Marca", "Instagram", "Rueda de prensa"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔹 Crear tabla de análisis NLP (Generado por IA)
CREATE TABLE nlp_analysis (
    id SERIAL PRIMARY KEY,
    declaration_id INT NOT NULL REFERENCES declarations(id) ON DELETE CASCADE,
    emocion_detectada VARCHAR(250) NOT NULL, -- "Felicidad", "Ansiedad", "Ira", etc.
    tendencia_emocional TEXT NOT NULL, -- Cómo han cambiado las emociones con el tiempo
    impacto_en_rendimiento VARCHAR(50) NOT NULL, -- "Positivo", "Negativo" o "Neutro"
    impacto_en_equipo VARCHAR(250) NOT NULL, -- "Positivo", "Negativo" o "Neutro"
    estado_actual_emocional VARCHAR(250) NOT NULL, -- "Estable", "Inestable", "En riesgo"
    rendimiento_predicho VARCHAR(250) NOT NULL, -- "Alto", "Medio", "Bajo"
    resumen_general TEXT NOT NULL, -- Explicación global sobre el estado emocional del jugador
    acciones_recomendadas TEXT NOT NULL, -- Sugerencias para mejorar su estabilidad emocional
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔹 Crear tabla de reportes (Consolidado final con información de la IA)
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    player_id INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    declaration_id INT NOT NULL REFERENCES declarations(id) ON DELETE CASCADE,
    nlp_analysis_id INT NOT NULL REFERENCES nlp_analysis(id) ON DELETE CASCADE,
    generado_por INT NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Usuario que generó el reporte
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
