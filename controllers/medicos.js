const { response } = require("express");
const medico = require("../models/medico");
const Medico = require("../models/medico");

const getMedicos = async (req, res = response) => {
  const medicos = await Medico.find()
    .populate("usuario", "nombre img")
    .populate("hospital", "nombre img");

  res.json({
    ok: true,
    medicos,
  });
};

const getMedicoById = async (req, res = response) => {
  // id del medico
  const id = req.params.id;

  try {
    const medico = await Medico.findById(id)
      .populate("usuario", "nombre img")
      .populate("hospital", "nombre img");

    res.json({
      ok: true,
      medico,
    });
  } catch (error) {
    res.json({
      ok: true,
      msg: "Médico no encontrado",
    });
  }
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
  // id del medico
  const id = req.params.id;
  // id del usuario
  const uid = req.uid; //Tengo acceso porque ya paso por la autenticacion de jwt

  try {
    const medicoDB = await Medico.findById(id);

    if (!medicoDB) {
      res.status(404).json({
        ok: false,
        msg: "Medico no encontrado por id",
      });
    }

    const cambiosMedico = { ...req.body, usuario: uid };

    const medicoActualizado = await Medico.findByIdAndUpdate(
      id,
      cambiosMedico,
      { new: true }
    );

    res.json({
      ok: true,
      medicoActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};
const borrarMedico = async (req, res = response) => {
  // id del medico
  const id = req.params.id;

  try {
    const medicoDB = await Medico.findById(id);

    if (!medicoDB) {
      res.status(404).json({
        ok: false,
        msg: "Medico no encontrado por id",
      });
    }

    await Medico.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Médico eliminado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getMedicos,
  crearMedico,
  actualizarMedico,
  borrarMedico,
  getMedicoById,
};
