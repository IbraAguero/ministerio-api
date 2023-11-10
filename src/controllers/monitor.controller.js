import Monitor from "../models/monitor.model.js";
import Place from "../models/place.model.js";
import State from "../models/state.model.js";
import Maker from "../models/maker.model.js";
import Model from "../models/model.model.js";
import Type from "../models/type.model.js";
import Supplier from "../models/supplier.model.js";
import mongoose from "mongoose";

export const getMonitors = async (req, res) => {
  try {
    const monitors = await Monitor.find()
      .populate(
        "maker model type place state supplier createdBy",
        "name username email"
      )
      .lean();
    return res.json(monitors);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getMonitor = async (req, res) => {
  try {
    const id = req.params.id;

    /* if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de fabricante inválido' });
    } */

    const monitor = await Monitor.findById(id).populate(
      "maker model place state createdBy",
      "name username email"
    );

    if (!monitor)
      return res.status(404).json({ message: "Monitor no encontrado" });
    return res.json(monitor);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

export const createMonitor = async (req, res) => {
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

    const validMaker = await Maker.exists({ _id: maker, type: "monitor" });
    if (!validMaker) {
      return res
        .status(400)
        .json({ message: "No existe el fabricante ingresado" });
    }

    const validModel = await Model.exists({ _id: model, type: "monitor" });
    if (!validModel) {
      return res.status(400).json({ message: "No existe el modelo ingresado" });
    }

    const validType = await Type.exists({ _id: type, type: "monitor" });
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

    const monitorFound = await Monitor.findOne({ nroinventario });
    if (monitorFound)
      return res
        .status(400)
        .json({ message: "El nroinventario ya esta en uso" });

    const newMonitor = new Monitor({
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
    const savedMonitor = await newMonitor.save();

    return res
      .status(201)
      .json({ data: savedMonitor, message: "Monitor creado exitosamente" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const deleteMonitor = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de fabricante inválido" });
    }

    const monitor = await Monitor.findByIdAndDelete(id);

    if (!monitor)
      return res.status(404).json({ message: "Monitor no encontrado" });

    return res
      .sendStatus(204)
      .json({ message: "Monitor eliminado exitosamente!" });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

export const updateMonitor = async (req, res) => {
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

    const validMaker = await Maker.exists({ _id: maker, type: "monitor" });
    if (!validMaker) {
      return res
        .status(400)
        .json({ message: "No existe el fabricante ingresado" });
    }

    const validModel = await Model.exists({ _id: model, type: "monitor" });
    if (!validModel) {
      return res.status(400).json({ message: "No existe el modelo ingresado" });
    }

    const validType = await Type.exists({ _id: type, type: "monitor" });
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

    const monitorFound = await Monitor.findOne({
      nroinventario,
      _id: { $ne: id },
    });
    if (monitorFound)
      return res
        .status(400)
        .json({ message: "El nroinventario ya esta en uso" });

    const monitor = await Monitor.findById(id);

    if (!monitor)
      return res.status(404).json({ message: "Monitor no encontrado" });

    const change = {
      user: req.userId,
      values: [],
    };

    if (nroinventario !== monitor.nroinventario) {
      change.values.push({
        field: "Nro Inventario",
        oldValue: monitor.nroinventario,
        newValue: nroinventario,
      });
      monitor.nroinventario = nroinventario;
    }

    if (place !== monitor.place.toString()) {
      const oldPlace = await Place.findById(monitor.place);
      const newPlace = await Place.findById(place);

      change.values.push({
        field: "Lugar",
        oldValue: oldPlace.name,
        newValue: newPlace.name,
      });
      monitor.place = place;
    }

    if (state !== monitor.state.toString()) {
      const oldState = await State.findById(monitor.state);
      const newState = await State.findById(state);

      change.values.push({
        field: "Estado",
        oldValue: oldState.name,
        newValue: newState.name,
      });
      monitor.state = state;
    }

    if (mandated !== monitor.mandated) {
      change.values.push({
        field: "Encargado",
        oldValue: monitor.mandated,
        newValue: mandated,
      });
      monitor.mandated = mandated;
    }

    if (comment !== monitor.comment) {
      change.values.push({
        field: "Comentario",
        oldValue: monitor.comment,
        newValue: comment,
      });
      monitor.comment = comment;
    }

    if (change.values.length > 0) {
      monitor.changes.push(change);
    }

    monitor.nroserie = nroserie;
    monitor.maker = maker;
    monitor.model = model;
    monitor.type = type;
    monitor.supplier = supplier;
    monitor.order = order;

    await monitor.save();

    /* const monitor = await Monitor.findByIdAndUpdate(
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

    if (!monitor)
      return res.status(404).json({ message: 'Monitor no encontrado' }); */

    return res
      .status(201)
      .json({ data: monitor, message: "Monitor editado exitosamente" });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};
