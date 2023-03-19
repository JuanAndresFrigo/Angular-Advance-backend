require("dotenv").config();

const path = require("path");

const express = require("express");
const cors = require("cors");

const { dbConnection } = require("./database/config");

//Crear el servidor de express
const app = express();

// Configurar CORS
app.use(cors());

// Carpeta publica
app.use(express.static("public"));

// Lectura y parseo del body
app.use(express.json());

// Base de datos
dbConnection();

// Rutas
app.use("/api/login", require("./routes/auth"));
app.use("/api/todo", require("./routes/busquedas"));
app.use("/api/uploads", require("./routes/uploads"));

app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/hospitales", require("./routes/hospitales"));
app.use("/api/medicos", require("./routes/medicos"));

//Ruta defecto
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/index.html"));
});

app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en el puerto: ", process.env.PORT);
});
