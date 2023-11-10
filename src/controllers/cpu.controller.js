import { CPU } from '../models/computer.model.js';

export const getCPUs = async (req, res) => {
  try {
    const CPUs = await CPU.find().populate('maker', 'name').lean();
    return res.json(CPUs);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createCPU = async (req, res) => {
  try {
    const { maker, model, type, frequency, cores } = req.body;

    const existingCPU = await CPU.findOne({
      maker,
      model,
      type,
      frequency,
      cores,
    });

    if (existingCPU)
      return res.status(400).json({
        message: 'Ya existe ese CPU',
      });

    const newCPU = new CPU({
      maker,
      model,
      type,
      frequency,
      cores,
      //user: req.user.id,
    });

    const savedCPU = await newCPU.save();
    return res.json(savedCPU);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// FALTA AGREGAR ACTUALIZAR Y ELIMINAR
