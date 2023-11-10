import { HDD } from '../models/computer.model.js';

export const getHDDs = async (req, res) => {
  try {
    const HDDs = await HDD.find().populate('maker type', 'name').lean();
    return res.json(HDDs);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createHDD = async (req, res) => {
  try {
    const { maker, model, type, capacity } = req.body;

    const existingHDD = await HDD.findOne({
      maker,
      model,
      type,
      capacity,
    });

    if (existingHDD)
      return res.status(400).json({
        message: 'Ya existe ese disco duro',
      });

    const newHDD = new HDD({
      maker,
      model,
      type,
      capacity,
      //user: req.user.id,
    });

    const savedHDD = await newHDD.save();
    return res.json(savedHDD);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// FALTA AGREGAR ACTUALIZAR Y ELIMINAR
