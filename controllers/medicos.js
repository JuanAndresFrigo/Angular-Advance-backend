const { response } = require("express");
const Medico = require("../models/medico");

const getMedico = async (req, res = response) => {
  const medicos = await Medico.find()
    .populate("usuario", "nombre img")
    .populate("hospital", "nombre img");

  res.json({
    ok: true,
    medicos,
  });
};

const crearMedico = async (req, res = response) => {
  const uid = req.uid;

  const medico = new Medico({
    usuario: uid,
    ...req.body,
  });

  try {
    const meidicoDB = await medico.save();

    res.json({
      ok: true,
      medico: meidicoDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarMedico = async (req, res = response) => {
  res.json({
    ok: true,
    msg: "actualizarMedico",
  });
};
const borrarMedico = async (req, res = response) => {
  res.json({
    ok: true,
    msg: "borrarMedico",
  });
};

module.exports = {
  getMedico,
  crearMedico,
  actualizarMedico,
  borrarMedico,
};
