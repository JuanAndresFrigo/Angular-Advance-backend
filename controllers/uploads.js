const { v4: uuidv4 } = require("uuid");
const { actualizarImagen } = require("../helpers/actualizar-imagen");
const path = require("path");
const fs = require("fs");

const fileUpload = async (req, res) => {
  const tipo = req.params.tipo;
  const id = req.params.id;

  // Validar tipos
  const tiposValidos = ["hospitales", "medicos", "usuarios"];
  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      ok: false,
      msg: "No es un médico, usuario u hospital (tipo)",
    });
  }

  // Validar que exista un archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "No hay ningun archivo",
    });
  }

  // Procesar la imagen
  const file = req.files.imagen;

  const nombreCortado = file.name.split("."); //nombre.2.jpg
  const extensionArchivo = nombreCortado[nombreCortado.length - 1];

  // Validar extension
  const extensionesValidas = ["png", "jpg", "jpeg", "gif"];
  if (!extensionesValidas.includes(extensionArchivo)) {
    return res.status(400).json({
      ok: false,
      msg: "No es una extension permitida",
    });
  }

  //Generar el nombre del archivo
  const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

  //Path para guardar la imagen
  const path = `./uploads/${tipo}/${nombreArchivo}`;

  // Movre la imagen
  file.mv(path, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        ok: false,
        msg: "Error al mover la imagen",
      });
    }

    // Actualizar DB
    actualizarImagen(tipo, id, nombreArchivo);

    res.json({
      ok: true,
      msg: "Archivo subido",
      nombreArchivo,
    });
    // res.send("File uploaded!");
  });
};

const retornaImagen = async (req, res) => {
  const tipo = req.params.tipo;
  const foto = req.params.foto;

  const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

  //Imagen por defecto
  if (fs.existsSync(pathImg)) {
    res.sendfile(pathImg);
  } else {
    const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
    res.sendfile(pathImg);
  }
};

module.exports = {
  fileUpload,
  retornaImagen,
};
