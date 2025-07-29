const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const server = express();
server.use(cors());
server.use(express.json());

// conexión a la base de datos
const getConnection = async () => {
    return await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",           // sin contraseña explícitamente
      database: "simpsons",
      port: 3306
    });
  };

// ruta real GET /frases
server.get("/frases", async (req, res) => {
  console.log("📥 Llegó a /frases");

  try {
    const conn = await getConnection();
    const [result] = await conn.query(`
      SELECT frases.id, frases.texto, frases.marca_tiempo, frases.descripcion,
             personajes.nombre AS personaje
      FROM frases
      JOIN personajes ON frases.personaje_id = personajes.id
    `);
    await conn.end();

    res.json({
      info: { count: result.length },
      result: result
    });
  } catch (err) {
    console.error("❌ Error en la consulta:", err);
    res.status(500).json({ error: "Error al obtener las frases" });
  }
});

// escuchar el servidor
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`🚀 Servidor encendido en http://localhost:${port}`);
});



