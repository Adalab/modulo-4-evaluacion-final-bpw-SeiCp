const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require('dotenv').config();

const server = express();
server.use(cors());
server.use(express.json());

// conexión a la base de datos
const getConnection = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });
};

// ruta real GET /frases
server.get('/frases', async (req, res) => { //se crea la ruta para get/frases. Get para obtener 
  
    const conn = await getConnection(); //Llamamos a la función
    const [result] = await conn.query(`
      SELECT frases.id, frases.texto, frases.marca_tiempo, frases.descripcion,
         personajes.nombre AS personaje,
         capitulos.titulo AS capitulo
      FROM frases
      JOIN personajes ON frases.personaje_id = personajes.id
      LEFT JOIN capitulos ON frases.capitulo_id = capitulos.id`); //Hacemos la consulta pero en lugar de solo ids, jutamos la frase con cada personaje y capítulo
    await conn.end(); //cerramos la conexión tras la consulta

    res.json({
      info: { count: result.length }, //Es la info del back al
      result: result
    });
    
});

server.get('/frases/:id', async (req, res) => {
  const fraseId = req.params.id;

    const conn = await getConnection();
    const [result] = await conn.query(
      `
      SELECT frases.id, frases.texto, frases.marca_tiempo, frases.descripcion,
             personajes.nombre AS personaje
      FROM frases
      JOIN personajes ON frases.personaje_id = personajes.id
      WHERE frases.id = ?
    `,
      [fraseId]
    );
    await conn.end();

    if (result.length === 0) {
      res.status(404).json({ error: "Frase no encontrada" });
    } else {
      res.json(result[0]);
    }
});

server.get('/personajes', async (req, res) => {
  try {
    const conn = await getConnection();
    const [results] = await conn.query('SELECT * FROM personajes');
    await conn.end();

    res.json(results);
  } catch (error) {
    console.error('❌ Error en la consulta de personajes:', error);
    res.status(500).json({ error: 'Error al obtener los personajes' });
  }
});

server.post("/frases", async (req, res) => {
  try {
    const { texto, marca_tiempo, descripcion, personaje_id } = req.body;

    if (!texto || !personaje_id) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const conn = await getConnection();
    const [result] = await conn.query(
      `
      INSERT INTO frases (texto, marca_tiempo, descripcion, personaje_id)
      VALUES (?, ?, ?, ?)
    `,
      [texto, marca_tiempo, descripcion, personaje_id]
    );
    await conn.end();

    res.status(201).json({
      success: true,
      id: result.insertId,
      message: "Frase insertada correctamente"
    });
  } catch (err) {
    console.error("❌ Error al insertar frase:", err);
    res.status(500).json({ error: "Error al insertar la frase" });
  }
});

server.put("/frases/:id", async (req, res) => {
  const fraseId = req.params.id;
  const { texto, marca_tiempo, descripcion, personaje_id } = req.body;

  if (!texto || !personaje_id) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const conn = await getConnection();
    const [result] = await conn.query(
      `
      UPDATE frases
      SET texto = ?, marca_tiempo = ?, descripcion = ?, personaje_id = ?
      WHERE id = ?
    `,
      [texto, marca_tiempo, descripcion, personaje_id, fraseId]
    );
    await conn.end();

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Frase no encontrada" });
    } else {
      res.json({ success: true, message: "Frase actualizada correctamente" });
    }
  } catch (err) {
    console.error("❌ Error al actualizar frase:", err);
    res.status(500).json({ error: "Error al actualizar la frase" });
  }
});

server.delete("/frases/:id", async (req, res) => {
  const fraseId = req.params.id;

  try {
    const conn = await getConnection();
    const [result] = await conn.query(
      `DELETE FROM frases WHERE id = ?`,
      [fraseId]
    );
    await conn.end();

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Frase no encontrada" });
    } else {
      res.json({ success: true, message: "Frase eliminada correctamente" });
    }
  } catch (err) {
    console.error("❌ Error al eliminar frase:", err);
    res.status(500).json({ error: "Error al eliminar la frase" });
  }
});

server.get("/frases/personaje/:personaje_id", async (req, res) => {
  const personajeId = req.params.personaje_id;

  try {
    const conn = await getConnection();
    const [results] = await conn.query(
      `
      SELECT frases.id, frases.texto, frases.marca_tiempo, frases.descripcion,
             personajes.nombre AS personaje
      FROM frases
      JOIN personajes ON frases.personaje_id = personajes.id
      WHERE personaje_id = ?
    `,
      [personajeId]
    );
    await conn.end();

    res.json({
      info: { count: results.length },
      result: results
    });
  } catch (err) {
    console.error("❌ Error en frases por personaje:", err);
    res.status(500).json({ error: "Error al obtener frases del personaje" });
  }
});

server.get("/capitulos", async (req, res) => {
  try {
    const conn = await getConnection();
    const [results] = await conn.query(`
      SELECT id, titulo, numero_episodio, temporada, fecha_emision, sinopsis
      FROM capitulos
    `);
    await conn.end();

    res.json({
      info: { count: results.length },
      result: results
    });
  } catch (err) {
    console.error("❌ Error al obtener capítulos:", err);
    res.status(500).json({ error: "Error al obtener los capítulos" });
  }
});

server.get("/frases/capitulo/:capitulo_id", async (req, res) => {
  const capituloId = req.params.capitulo_id;

  try {
    const conn = await getConnection();
    const [results] = await conn.query(
      `
      SELECT frases.id, frases.texto, frases.marca_tiempo, frases.descripcion,
             personajes.nombre AS personaje,
             capitulos.titulo AS capitulo
      FROM frases
      JOIN personajes ON frases.personaje_id = personajes.id
      JOIN capitulos ON frases.capitulo_id = capitulos.id
      WHERE frases.capitulo_id = ?
    `,
      [capituloId]
    );
    await conn.end();

    res.json({
      info: { count: results.length },
      result: results
    });
  } catch (err) {
    console.error("❌ Error en frases por capítulo:", err);
    res.status(500).json({ error: "Error al obtener frases del capítulo" });
  }
});


// escuchar el servidor
const port = process.env.PORT || 4000;//Puerto en el que se ejecuta el servidor. El 3306 es de la base de datos
server.listen(port, () => {
  console.log(`🚀 Servidor encendido en http://localhost:${port}`);
});



