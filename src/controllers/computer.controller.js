import { Computer } from "../models/computer.model.js";
import { MotherBoard } from "../models/computer.model.js";
import { CPU } from "../models/computer.model.js";
import { RAM } from "../models/computer.model.js";
import { HDD } from "../models/computer.model.js";
import { GraphicCard } from "../models/computer.model.js";
import Place from "../models/place.model.js";
import State from "../models/state.model.js";
import Supplier from "../models/supplier.model.js";

export const getComputers = async (req, res) => {
  try {
    const computers = await Computer.find()
      .populate(
        "cpu ram hdd motherBoard graphicCard place state supplier createdBy",
        "maker model capacity name username email"
      )
      .lean();
    return res.json(computers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createComputer = async (req, res) => {
  try {
    const {
      nroinventario,
      nroserie,
      motherBoard,
      cpu,
      ram,
      hdd,
      graphicCard,
      place,
      state,
      supplier,
      order,
      comment,
      mandated,
    } = req.validData;

    const validCpu = await CPU.exists({ _id: cpu });
    if (!validCpu) {
      return res.status(400).json({ message: "No existe el cpu ingresado" });
    }

    const validRAM = await RAM.exists({ _id: ram });
    if (!validRAM) {
      return res.status(400).json({ message: "No existe la RAM ingresada" });
    }

    if (motherBoard) {
      const validMotherBoard = await MotherBoard.exists({ _id: motherBoard });
      if (!validMotherBoard) {
        return res
          .status(400)
          .json({ message: "No existe la placa madre ingresada" });
      }
    }

    const validHDD = await HDD.exists({ _id: hdd });
    if (!validHDD) {
      return res
        .status(400)
        .json({ message: "No existe el disco duro ingresado" });
    }

    if (graphicCard) {
      const validGraphicCard = await GraphicCard.exists({ _id: graphicCard });
      if (!validGraphicCard) {
        return res
          .status(400)
          .json({ message: "No existe la tarjeta grafica ingresada" });
      }
    }

    const validState = await State.exists({ _id: state });
    if (!validState) {
      return res.status(400).json({ message: "No existe el estado ingresado" });
    }

    const validPlace = await Place.exists({ _id: place });
    if (!validPlace) {
      return res.status(400).json({ message: "No existe el lugar ingresado" });
    }

    if (supplier) {
      const validSuplier = await Supplier.exists({ _id: supplier });
      if (!validSuplier) {
        return res
          .status(400)
          .json({ message: "No existe el proveedor ingresado" });
      }
    }

    const computerFound = await Computer.findOne({ nroinventario });
    if (computerFound)
      return res
        .status(400)
        .json({ message: "El nroinventario ya esta en uso" });

    const newComputer = new Computer({
      nroinventario,
      nroserie,
      motherBoard,
      cpu,
      ram,
      hdd,
      graphicCard,
      place,
      state,
      supplier,
      order,
      mandated,
      comment,
      createdBy: req.userId,
    });
    const savedComputer = await newComputer.save();

    return res.status(201).json({
      data: savedComputer,
      message: "Computadora creada exitosamente",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
