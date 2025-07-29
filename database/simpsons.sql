-- Tabla de personajes
CREATE TABLE personajes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100),
  ocupacion VARCHAR(150),
  descripcion TEXT
);

-- Tabla de capítulos
CREATE TABLE capitulos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  numero_episodio INT,
  temporada INT,
  fecha_emision DATE,
  sinopsis TEXT
);

-- Tabla intermedia para personajes y capítulos
CREATE TABLE personaje_capitulo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  personaje_id INT NOT NULL,
  capitulo_id INT NOT NULL,
  FOREIGN KEY (personaje_id) REFERENCES personajes(id),
  FOREIGN KEY (capitulo_id) REFERENCES capitulos(id)
);

-- Tabla de frases míticas
CREATE TABLE frases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  texto TEXT NOT NULL,
  marca_tiempo VARCHAR(10),
  descripcion TEXT,
  personaje_id INT NOT NULL,
  FOREIGN KEY (personaje_id) REFERENCES personajes(id)
);

-- Insertar personajes
INSERT INTO personajes (nombre, apellido, ocupacion, descripcion)
VALUES 
('Homer', 'Simpson', 'Inspector de seguridad', 'Ama las rosquillas'),
('Lisa', 'Simpson', 'Estudiante', 'Toca el saxofón y es feminista'),
('Bart', 'Simpson', 'Estudiante', 'Bromista y travieso'),
('Marge', 'Simpson', 'Ama de casa', 'Tiene el pelo azul'),
('Burns', 'Montgomery', 'Dueño de la planta nuclear', 'Anciano malvado');

-- Insertar frases míticas
INSERT INTO frases (texto, marca_tiempo, descripcion, personaje_id)
VALUES
("D'oh!", '00:03', "Frase clásica de Homer", 1),
("Muy bien. No me casaré nunca", NULL, "Frase irónica de Lisa", 2),
("¡Ay, caramba!", NULL, "Frase típica de Bart", 3),
("A veces una mujer tiene que defenderse por sí misma", NULL, NULL, 4),
("¡Excelente!", '00:15', "Típica de Burns", 5);