He aquí una guía para amigas de las APIS, aunque te parezca tan complejo que más que amigas, quieras ser solo su vecina para solo tener que saludarla en el pasillo.

Hay que aprender amigas, así que bienvenidas a:

# "Cómo consumir esta API sin volverse loca":

Vale, si has llegado hasta aquí, es porque quieres usar la API de frases míticas de Los Simpsons. Te explico cómo va esto, sin dramas (o lo intentaré, no prometo nada).

**Primero:** la base de todo es que las frases están conectadas con los personajes y los capítulos donde aparecen. Así que cada vez que pidas una frase, vas a recibir no solo el texto, sino también quién la dijo y en qué capítulo (si se sabe).

# Endpoints disponibles

1. GET /frases
   Te devuelve un listado completo de frases. Cada frase viene con:

   El texto
   El personaje que la dijo
   El título del capítulo (si está asociado)

2. **GET /frases/:id**
   Devuelve una frase concreta. Ideal si ya tienes el ID y no quieres que te lo cuenten entero otra vez.

3. **POST /frases**
   Crea una frase nueva. Eso sí, necesitas mandarle un body en formato JSON algo así como esto:

   {
   "texto": "¡Ay, caramba!",
   "marca_tiempo": "00:12",
   "descripcion": "Frase mítica de Bart",
   "personaje_id": 3,
   "capitulo_id": 1
   }

4. **PUT /frases/:id**
   Actualiza una frase que ya existe. Existe porque la has creado tú, no porque tengas la varita de Harry Potter y hagas magia. En este caso, tenemos la suerte de que el formato de body es igual al del POST, pero con el ID de la frase en la URL.

5. **DELETE /frases/:id**
   Borra una frase. ¡No habrá vuelta atrás! Y es que un gran poder conlleva una gran responsabilidad. Aunque bueno si dejamos el drama siempre puedes hacer un POST y crear una nueva, pero quería meterle drama, ya me entiendes.

# Endpoints de búsqueda

1. **GET /frases/personaje/:personaje_id**
   Devuelve todas las frases dichas por un personaje concreto. Por ejemplo, puedes ver todo lo que ha dicho Bart si usas su ID.

2. **GET /frases/capitulo/:capitulo_id**
   Saca todas las frases de un capítulo específico. Por si tienes tiempo y quieres revivir momentazos.

3. **GET /personajes**
   Lista de todos los personajes que hay en la base de datos.

4. **GET /capitulos**
   Lista de todos los capítulos. Muy útil para hacer relaciones en el frontend o para elegir el ID al crear frases.

# Explicación extra o lo que se llama un bonus track de toda la vida:

- Todas las peticiones funcionan con http://localhost:4000/ si lo tienes en local (y dale cariño porque costó que funcionase, así que trátalo con amor).
- Cuando uses Postman para enviar datos (por ejemplo, al hacer POST o PUT), ve a la parte de abajo del enlacedonde pone "params", "Authorization", "Headers" y marca "Body", y debajo selecciona raw y JSON. Esto es como decirle: “te voy a pasar esto en formato .json, estate atento”.
- Las respuestas siempre devuelven algo como { success: true } o un error si algo va mal.

Espero que te sirva porque ni hacer esta explicación ha sido fácil.
