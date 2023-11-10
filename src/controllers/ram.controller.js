import { RAM } from '../models/computer.model.js';

export const getRAMs = async (req, res) => {
  try {
    const RAMs = await RAM.find().populate('maker type', 'name').lean();
    return res.json(RAMs);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createRAM = async (req, res) => {
  try {
    const { maker, model, type, capacity, frequency } = req.body;

    const existingRAM = await RAM.findOne({
      maker,
      model,
      type,
      frequency,
      capacity,
    });

    if (existingRAM)
      return res.status(400).json({
        message: 'Ya existe esa RAM',
      });

    const newRAM = new RAM({
      maker,
      model,
      type,
      frequency,
      capacity,
      //user: req.user.id,
    });

    const savedRAM = await newRAM.save();
    return res.json(savedRAM);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// FALTA AGREGAR ACTUALIZAR Y ELIMINAR
