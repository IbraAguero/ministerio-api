import Type from "../models/type.model.js";
import Printer from "../models/printer.model.js";
import Monitor from "../models/monitor.model.js";
import Peripheral from "../models/peripheral.model.js";
import mongoose from "mongoose";
import { transformType } from "../utils/transformType.js";

export const getTypes = async (req, res) => {
  const type = transformType(req.params.type);

  const types = await Type.find({ type });
  return res.json(types);
};

export const getType = async (req, res) => {
  const id = req.params.id;
  const typeParam = transformType(req.params.type);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID del tipo inválido" });
  }

  const type = await Type.findById(id);

  if (!type || type.type !== typeParam) {
    return res.status(404).json({ message: "Tipo no encontrado" });
  }

  return res.json(type);
};

export const createType = async (req, res) => {
  const { name } = req.validData;
  const typeParam = transformType(req.params.type);

  const typeFound = await Type.findOne({ name });

  if (typeFound)
    return res.status(400).json({
      message: "Ya existe un tipo con el mismo nombre",
    });

  const newType = new Type({
    name,
    type: typeParam,
    //user: req.user.id,
  });

  const savedType = await newType.save();

  return res.json(savedType);
};

export const deleteType = async (req, res) => {
  const id = req.params.id;
  const type = transformType(req.params.type);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID del tipo inválido" });
  }

  const isUsed = await isTypeInUse(id);

  if (isUsed) {
    return res.status(400).json({
      message:
        "No puedes eliminar este tipo porque está en uso en alguna categoría",
    });
  }

  const typeDelete = await Type.findOneAndDelete({ _id: id, type });
  if (!typeDelete)
    return res.status(404).json({ message: "Tipo no encontrado" });

  return res.sendStatus(204);
};

export const updateType = async (req, res) => {
  const { name } = req.validData;
  const id = req.params.id;
  const type = transformType(req.params.type);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID del tipo inválido" });
  }

  const typeFound = await Type.findOne({ name });

  if (typeFound)
    return res.status(400).json({
      message: "Ya existe un tipo con el mismo nombre",
    });

  const typeEdit = await Type.findOneAndUpdate(
    { _id: id, type },
    req.validData,
    {
      new: true,
    }
  );

  if (!typeEdit) return res.status(404).json({ message: "Tipo no encontrado" });
  return res.json(typeEdit);
};

async function isTypeInUse(id) {
  const printerExists = await Printer.exists({ model: id });
  const monitorExists = await Monitor.exists({ model: id });
  const peripheralExists = await Peripheral.exists({ model: id });
  //const computerExists = await Computer.exists({ model: id });

  return printerExists || monitorExists || peripheralExists; //|| computerExists || peripheralExists;
}
