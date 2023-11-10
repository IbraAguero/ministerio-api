import Peripheral from "../models/peripheral.model.js";
import Place from "../models/place.model.js";
import State from "../models/state.model.js";
import Maker from "../models/maker.model.js";
import Model from "../models/model.model.js";
import Type from "../models/type.model.js";
import Supplier from "../models/supplier.model.js";
import mongoose from "mongoose";

export const getPeripherals = async (req, res) => {
  try {
    const peripherals = await Peripheral.find()
      .populate(
        "maker model type place state supplier createdBy",
        "name username email"
      )
      .lean();
    return res.json(peripherals);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getPeripheral = async (req, res) => {
  try {
    const id = req.params.id;

    /* if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de fabricante inválido' });
    } */

    const peripheral = await Peripheral.findById(id).populate(
      "maker model place state createdBy",
      "name username email"
    );

    if (!peripheral)
      return res.status(404).json({ message: "Periferico no encontrado" });
    return res.json(peripheral);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

export const createPeripheral = async (req, res) => {
  try {
    const {
      nroinventario,
      nroserie,
      maker,
      model,
      type,
      place,
      state,
      supplier,
      order,
      comment,
      mandated,
    } = req.validData;

    const validMaker = await Maker.exists({ _id: maker, type: "periferico" });
    if (!validMaker) {
      return res
        .status(400)
        .json({ message: "No existe el fabricante ingresado" });
    }

    const validModel = await Model.exists({ _id: model, type: "periferico" });
    if (!validModel) {
      return res.status(400).json({ message: "No existe el modelo ingresado" });
    }

    const validType = await Type.exists({ _id: type, type: "periferico" });
    if (!validType) {
      return res.status(400).json({ message: "No existe el tipo ingresado" });
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

    const peripheralFound = await Peripheral.findOne({ nroinventario });
    if (peripheralFound)
      return res
        .status(400)
        .json({ message: "El nroinventario ya esta en uso" });

    const newPeripheral = new Peripheral({
      nroinventario,
      nroserie,
      maker,
      model,
      type,
      place,
      state,
      supplier,
      order,
      mandated,
      comment,
      createdBy: req.userId,
    });
    const savedPeripheral = await newPeripheral.save();

    return res.status(201).json({
      data: savedPeripheral,
      message: "Periferico creado exitosamente",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const deletePeripheral = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de fabricante inválido" });
    }

    const peripheral = await Peripheral.findByIdAndDelete(id);

    if (!peripheral)
      return res.status(404).json({ message: "Periferico no encontrado" });

    return res
      .sendStatus(204)
      .json({ message: "Periferico eliminado exitosamente!" });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

export const updatePeripheral = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de fabricante inválido" });
    }

    const {
      nroinventario,
      nroserie,
      maker,
      model,
      type,
      place,
      state,
      supplier,
      order,
      comment,
      mandated,
    } = req.validData;

    const validMaker = await Maker.exists({ _id: maker, type: "periferico" });
    if (!validMaker) {
      return res
        .status(400)
        .json({ message: "No existe el fabricante ingresado" });
    }

    const validModel = await Model.exists({ _id: model, type: "periferico" });
    if (!validModel) {
      return res.status(400).json({ message: "No existe el modelo ingresado" });
    }

    const validType = await Type.exists({ _id: type, type: "periferico" });
    if (!validType) {
      return res.status(400).json({ message: "No existe el tipo ingresado" });
    }

    const validState = await State.exists({ _id: state });
    if (!validState) {
      return res.status(400).json({ message: "No existe el estado ingresado" });
    }

    const validLugar = await Place.exists({ _id: place });
    if (!validLugar) {
      return res.status(400).json({ message: "No existe el lugar ingresado" });
    }

    const validSuplier = await Supplier.exists({ _id: supplier });
    if (!validSuplier) {
      return res
        .status(400)
        .json({ message: "No existe el proveedor ingresado" });
    }

    const peripheralFound = await Peripheral.findOne({
      nroinventario,
      _id: { $ne: id },
    });
    if (peripheralFound)
      return res
        .status(400)
        .json({ message: "El nroinventario ya esta en uso" });

    const peripheral = await Peripheral.findById(id);

    if (!peripheral)
      return res.status(404).json({ message: "Periferico no encontrado" });

    const change = {
      user: req.userId,
      values: [],
    };

    if (nroinventario !== peripheral.nroinventario) {
      change.values.push({
        field: "Nro Inventario",
        oldValue: peripheral.nroinventario,
        newValue: nroinventario,
      });
      peripheral.nroinventario = nroinventario;
    }

    if (place !== peripheral.place.toString()) {
      const oldPlace = await Place.findById(peripheral.place);
      const newPlace = await Place.findById(place);

      change.values.push({
        field: "Lugar",
        oldValue: oldPlace.name,
        newValue: newPlace.name,
      });
      peripheral.place = place;
    }

    if (state !== peripheral.state.toString()) {
      const oldState = await State.findById(peripheral.state);
      const newState = await State.findById(state);

      change.values.push({
        field: "Estado",
        oldValue: oldState.name,
        newValue: newState.name,
      });
      peripheral.state = state;
    }

    if (mandated !== peripheral.mandated) {
      change.values.push({
        field: "Encargado",
        oldValue: peripheral.mandated,
        newValue: mandated,
      });
      peripheral.mandated = mandated;
    }

    if (comment !== peripheral.comment) {
      change.values.push({
        field: "Comentario",
        oldValue: peripheral.comment,
        newValue: comment,
      });
      peripheral.comment = comment;
    }

    if (change.values.length > 0) {
      peripheral.changes.push(change);
    }

    peripheral.nroserie = nroserie;
    peripheral.maker = maker;
    peripheral.model = model;
    peripheral.type = type;
    peripheral.supplier = supplier;
    peripheral.order = order;

    await peripheral.save();

    /* const peripheral = await Peripheral.findByIdAndUpdate(
      id,
      {
        nroinventario,
        nroserie,
        maker,
        model,
        type,
        place,
        state,
        supplier,
        order,
        mandated,
        comment,
      },
      {
        new: true,
      }
    );

    if (!peripheral)
      return res.status(404).json({ message: 'Peripheral no encontrado' }); */

    return res
      .status(201)
      .json({ data: peripheral, message: "Periferico editado exitosamente" });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};
