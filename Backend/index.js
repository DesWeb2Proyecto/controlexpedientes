const express = require("express");
const cors = require("cors");
const sequelize = require("./db/conexion"); // 📌 Importar conexión con la BD

// 📌 Importar modelos
const Users = require("./models/Users");
const Expedientes = require("./models/Expedientes");
const Historial = require("./models/Historial");

// 📌 Definir relaciones después de importar modelos
Expedientes.hasMany(Historial, { foreignKey: "id_expediente" });
Historial.belongsTo(Expedientes, { foreignKey: "id_expediente" });

Historial.belongsTo(Users, { foreignKey: "id_usuario" });
Users.hasMany(Historial, { foreignKey: "id_usuario" });

// 📌 Sincronizar la base de datos (IMPORTANTE)
sequelize.sync()
  .then(() => console.log("Base de datos sincronizada correctamente"))
  .catch((error) => console.error("Error al sincronizar BD:", error));

// Inicializar Express
const app = express();
app.use(express.json());
app.use(cors());

// Iniciar servidor
app.listen(5000, () => {
  console.log("Servidor ejecutándose en puerto 5000");
});

//--------------------------------------Usuarios--------------------------------------//
// Obtener usuarios
app.get("/users", async (req, res) => {
  try {
    const usuarios = await Users.findAll();
    if (!usuarios.length) {
      return res.status(404).json({ mensaje: "No hay usuarios registrados." });
    }
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Ocurrio un error en la peticion." });
  }
});

// Login de usuario con comparación simple de contraseña
app.post("/users/login", async (req, res) => {
  const { nombre_usuario, contrasena } = req.body;

  try {
    // Buscar usuario por nombre de usuario
    const usuario = await Users.findOne({ where: { nombre_usuario } });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    // Comparar contraseñas sin hasheo
    if (contrasena !== usuario.contrasena) {
      return res.status(401).json({ mensaje: "Credenciales incorrectas." });
    }

    // Responder con los datos del usuario, incluyendo la unidad
    res.json({
      id_usuario: usuario.id_usuario,
      nombre_completo: usuario.nombre_completo,
      nombre_usuario: usuario.nombre_usuario,
      unidad_area: usuario.unidad_area,  // 🔹 Devuelve la unidad del usuario
      administrador: usuario.administrador,
    });

  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ error: "Ocurrió un error en la autenticación." });
  }
});

//---------------------------------Expedientes-----------------------------------------//
// Obtener expedientes
app.get("/expedientes", async (req, res) => {
  try {
    const expedientes = await Expedientes.findAll();
    if (!expedientes.length) {
      return res.status(404).json({ mensaje: "No hay registros de expedientes." });
    }
    res.json(expedientes);
  } catch (error) {
    console.error("Error al obtener expedientes:", error);
    res.status(500).json({ error: "Ocurrio un error en la peticion." });
  }
});

// Obtener expediente por numero_expediente
app.get("/expedientes/:numero_expediente", async (req, res) => {
  try {
    const { numero_expediente } = req.params;
    const expediente = await Expedientes.findOne({ where: { numero_expediente } });

    if (!expediente) {
      return res.status(404).json({ mensaje: "Expediente no encontrado." });
    }

    res.json(expediente);
  } catch (error) {
    console.error("Error al obtener expediente:", error);
    res.status(500).json({ error: "Ocurrió un error en la petición." });
  }
});

// Obtener expediente por unidad_area
app.get("/expedientes/unidad/:unidad", async (req, res) => {
  try {
    const { unidad } = req.params;

    // Buscar expedientes por unidad_area
    const expedientes = await Expedientes.findAll({
      where: { unidad_area: unidad }
    });

    if (!expedientes.length) {
      return res.status(404).json({ mensaje: "No hay expedientes en esta unidad." });
    }

    res.json(expedientes);
  } catch (error) {
    console.error("Error al obtener expedientes por unidad:", error);
    res.status(500).json({ error: "Ocurrió un error en la petición." });
  }
});

//crear expediente
app.post("/expedientes", async (req, res) => {
  try {
      const {
          numero_expediente,
          nombre_establecimiento,
          region_sanitaria,
          departamento,
          unidad_area,
          estado,
          id_usuario
      } = req.body;

      // Validaciones básicas
      if (!numero_expediente || !nombre_establecimiento || !region_sanitaria || !departamento || !unidad_area || !id_usuario) {
          return res.status(400).json({ error: "Todos los campos son obligatorios." });
      }

      // Verificar si el expediente ya existe
      const expedienteExiste = await Expedientes.findOne({ where: { numero_expediente } });
      if (expedienteExiste) {
          return res.status(400).json({ error: "El número de expediente ya existe." });
      }

      // Crear expediente en la base de datos
      const nuevoExpediente = await Expedientes.create({
          numero_expediente,
          nombre_establecimiento,
          region_sanitaria,
          departamento,
          unidad_area,
          estado: estado ?? true, // Si no se envía, será `true` por defecto
          fecha_creacion: new Date(),
          id_usuario
      });

      return res.status(201).json({ message: "Expediente creado exitosamente", expediente: nuevoExpediente });
  } catch (error) {
      console.error("Error al crear el expediente:", error.message);
      return res.status(500).json({ error: error.message });
  }
});


// Obtener expedientes asociados a un usuario
app.get("/expedientes/usuario/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar los expedientes que pertenecen al usuario
    const expedientes = await Expedientes.findAll({
      where: { id_usuario: id }, // Filtrar por el ID del usuario
    });

    if (!expedientes || expedientes.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron expedientes para este usuario" });
    }

    res.json(expedientes);
  } catch (error) {
    console.error("Error al obtener expedientes:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

//transferir expediente
app.put("/expedientes/transferir/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nueva_unidad, id_usuario } = req.body;

    // Verificar si el expediente existe
    const expediente = await Expedientes.findByPk(id);
    if (!expediente) {
      return res.status(404).json({ mensaje: "Expediente no encontrado." });
    }

    // Actualizar la unidad del expediente
    expediente.unidad_area = nueva_unidad;
    await expediente.save();

    // Registrar la transferencia en el historial
    await Historial.create({
      id_expediente: id,
      id_usuario: id_usuario,
      comentario: `El Expediente #: ${expediente.numero_expediente} fue trasladado a la Unidad: ${nueva_unidad}`
    });

    res.json({ mensaje: "Expediente transferido correctamente." });
  } catch (error) {
    console.error("Error al transferir expediente:", error);
    res.status(500).json({ error: "Ocurrió un error en la petición." });
  }
});

app.put("/expedientes/:id", async (req, res) => {
  const { id } = req.params;
  const datosActualizados = req.body;

  try {
    // Buscar el expediente por ID
    const expediente = await Expedientes.findByPk(id);

    if (!expediente) {
      return res.status(404).json({ error: "Expediente no encontrado" });
    }

    // Actualizar el expediente con los datos recibidos
    await expediente.update(datosActualizados);

    return res.json(expediente);
  } catch (error) {
    console.error("Error al actualizar expediente:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});



//---------------------------------Historial-----------------------------------------//
// Obtener Historial
app.get("/historial", async (req, res) => {
  try {
    const historial = await Historial.findAll();
    if (!historial.length) {
      return res.status(404).json({ mensaje: "No hay registros de historial." });
    }
    res.json(historial);
  } catch (error) {
    console.error("Error al obtener historial:", error);
    res.status(500).json({ error: "Ocurrio un error en la peticion." });
  }
});


// Ruta para obtener el historial de un expediente
app.get("/historial/expediente/:numero_expediente", async (req, res) => {
  try {
    const { numero_expediente } = req.params;

    // Buscar expediente por número
    const expediente = await Expedientes.findOne({
      where: { numero_expediente }
    });

    if (!expediente) {
      return res.status(404).json({ mensaje: "Expediente no encontrado." });
    }

    // Obtener el historial del expediente con datos del usuario
    const historial = await Historial.findAll({
      where: { id_expediente: expediente.id_expediente },
      include: [
        {
          model: Expedientes, // Relación con Expedientes
          attributes: ["numero_expediente", "nombre_establecimiento"]
        },
        {
          model: Users, // Relación con Usuarios
          attributes: ["id_usuario", "nombre_completo", "nombre_usuario", "unidad_area"]
        }
      ]
    });

    res.json({
      expediente: {
        id_expediente: expediente.id_expediente,
        numero_expediente: expediente.numero_expediente,
        nombre: expediente.nombre_establecimiento
      },
      historial
    });

  } catch (error) {
    console.error("Error al obtener el historial:", error);
    res.status(500).json({ error: "Error interno del servidor al obtener el historial del expediente." });
  }
});


// Historial de un usuario con los expedientes en los que ha participado
app.get("/historial/usuario/:id_usuario", async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const historialUsuario = await Historial.findAll({
      where: { id_usuario }, // Filtra los registros del historial por el usuario
      attributes: ["id", "id_expediente", "id_usuario", "fecha_transferencia", "comentario"], // Incluye comentario
      include: [
        {
          model: Expedientes, // Incluye información del expediente
          attributes: [
            "id_expediente",
            "numero_expediente",
            "nombre_establecimiento",
            "region_sanitaria",
            "departamento",
            "unidad_area",
            "estado",
            "fecha_creacion",
          ],
        },
        {
          model: Users, // Incluye información del usuario que realizó la transferencia
          attributes: ["id_usuario", "nombre_completo", "nombre_usuario"],
        },
      ],
    });

    if (!historialUsuario.length) {
      return res.status(404).json({ mensaje: "No hay registros en el historial para este usuario." });
    }

    res.json(historialUsuario);
  } catch (error) {
    console.error("Error al obtener el historial del usuario:", error);
    res.status(500).json({ error: "Error en la consulta.", error });
  }
});


//historial detallado con datos del usuario y el expediente
app.get("/historial/detallado", async (req, res) => {
  try {
      const historial = await Historial.findAll({
          include: [
              {
                  model: Users, // 🔹 Sin `as`
                  attributes: ["id_usuario", "nombre_completo", "nombre_usuario", "unidad_area"],
              },
              {
                  model: Expedientes,
                  attributes: [
                      "id_expediente",
                      "numero_expediente",
                      "nombre_establecimiento",
                      "region_sanitaria",
                      "departamento",
                      "unidad_area",
                      "estado",
                      "fecha_creacion",
                  ],
              },
          ],
          order: [["fecha_transferencia", "DESC"]],
      });

      return res.json(historial);
  } catch (error) {
      console.error("Error al obtener el historial detallado:", error);
      return res.status(500).json({ error: "Ocurrió un error en la consulta." });
  }
});
