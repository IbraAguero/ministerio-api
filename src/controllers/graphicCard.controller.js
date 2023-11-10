import { GraphicCard } from '../models/computer.model.js';

export const getGraphicCards = async (req, res) => {
  try {
    const graphicCards = await GraphicCard.find()
      .populate('maker', 'name')
      .lean();
    return res.json(graphicCards);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createGraphicCard = async (req, res) => {
  try {
    const { maker, model, memory } = req.body;

    const existingGraphicCard = await GraphicCard.findOne({
      maker,
      model,
      memory,
    });

    if (existingGraphicCard)
      return res.status(400).json({
        message: 'Ya existe esa tarjeta grafica',
      });

    const newGraphicCard = new GraphicCard({
      maker,
      model,
      memory,
      //user: req.user.id,
    });

    const savedGraphicCard = await newGraphicCard.save();
    return res.json(savedGraphicCard);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// FALTA AGREGAR ACTUALIZAR Y ELIMINAR
