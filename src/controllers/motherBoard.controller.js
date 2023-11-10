import { MotherBoard } from '../models/computer.model.js';

export const getMotherBoards = async (req, res) => {
  try {
    const MotherBoards = await MotherBoard.find()
      .populate('maker', 'name')
      .lean();
    return res.json(MotherBoards);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createMotherBoard = async (req, res) => {
  try {
    const { maker, model, socket } = req.body;

    const existingMotherBoard = await MotherBoard.findOne({
      maker,
      model,
      socket,
    });

    if (existingMotherBoard)
      return res.status(400).json({
        message: 'Ya existe esa placa madre',
      });

    const newMotherBoard = new MotherBoard({
      maker,
      model,
      socket,
      //user: req.user.id,
    });

    const savedMotherBoard = await newMotherBoard.save();
    return res.json(savedMotherBoard);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// FALTA AGREGAR ACTUALIZAR Y ELIMINAR
