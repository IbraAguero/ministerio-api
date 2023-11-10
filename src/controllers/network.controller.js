import Network from "../models/network.model.js";
import Place from "../models/place.model.js";
import State from "../models/state.model.js";
import Maker from "../models/maker.model.js";
import Model from "../models/model.model.js";
import Type from "../models/type.model.js";
import Supplier from "../models/supplier.model.js";
import mongoose from "mongoose";

export const getNetworks = async (req, res) => {
  try {
    const networks = await Network.find()
      .populate(
        "maker model type place state supplier createdBy",
        "name username email"
      )
      .lean();
    return res.json(networks);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getNetwork = async (req, res) => {
  try {
    const id = req.params.id;

    /* if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de fabricante inválido' });
    } */

    const network = await Network.findById(id).populate(
      "maker model place state createdBy",
      "name username email"
    );

    if (!network) return res.status(404).json({ message: "Red no encontrada" });
    return res.json(network);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

export const createNetwork = async (req, res) => {
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

    const validMaker = await Maker.exists({ _id: maker, type: "red" });
    if (!validMaker) {
      return res
        .status(400)
        .json({ message: "No existe el fabricante ingresado" });
    }

    const validModel = await Model.exists({ _id: model, type: "red" });
    if (!validModel) {
      return res.status(400).json({ message: "No existe el modelo ingresado" });
    }

    const validType = await Type.exists({ _id: type, type: "red" });
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

    const networkFound = await Network.findOne({ nroinventario });
    if (networkFound)
      return res
        .status(400)
        .json({ message: "El nroinventario ya esta en uso" });

    const newNetwork = new Network({
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
    const savedNetwork = await newNetwork.save();

    return res.status(201).json({
      data: savedNetwork,
      message: "Red creada exitosamente",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const deleteNetwork = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de fabricante inválido" });
    }

    const network = await Network.findByIdAndDelete(id);

    if (!network) return res.status(404).json({ message: "Red no encontrada" });

    return res.sendStatus(204).json({ message: "Red eliminada exitosamente!" });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

export const updateNetwork = async (req, res) => {
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

    const validMaker = await Maker.exists({ _id: maker, type: "red" });
    if (!validMaker) {
      return res
        .status(400)
        .json({ message: "No existe el fabricante ingresado" });
    }

    const validModel = await Model.exists({ _id: model, type: "red" });
    if (!validModel) {
      return res.status(400).json({ message: "No existe el modelo ingresado" });
    }

    const validType = await Type.exists({ _id: type, type: "red" });
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

    const networkFound = await Network.findOne({
      nroinventario,
      _id: { $ne: id },
    });
    if (networkFound)
      return res
        .status(400)
        .json({ message: "El nroinventario ya esta en uso" });

    const network = await Network.findById(id);

    if (!network) return res.status(404).json({ message: "Red no encontrada" });

    const change = {
      user: req.userId,
      values: [],
    };

    if (nroinventario !== network.nroinventario) {
      change.values.push({
        field: "Nro Inventario",
        oldValue: network.nroinventario,
        newValue: nroinventario,
      });
      network.nroinventario = nroinventario;
    }

    if (place !== network.place.toString()) {
      const oldPlace = await Place.findById(network.place);
      const newPlace = await Place.findById(place);

      change.values.push({
        field: "Lugar",
        oldValue: oldPlace.name,
        newValue: newPlace.name,
      });
      network.place = place;
    }

    if (state !== network.state.toString()) {
      const oldState = await State.findById(network.state);
      const newState = await State.findById(state);

      change.values.push({
        field: "Estado",
        oldValue: oldState.name,
        newValue: newState.name,
      });
      network.state = state;
    }

    if (mandated !== network.mandated) {
      change.values.push({
        field: "Encargado",
        oldValue: network.mandated,
        newValue: mandated,
      });
      network.mandated = mandated;
    }

    if (comment !== network.comment) {
      change.values.push({
        field: "Comentario",
        oldValue: network.comment,
        newValue: comment,
      });
      network.comment = comment;
    }

    if (change.values.length > 0) {
      network.changes.push(change);
    }

    network.nroserie = nroserie;
    network.maker = maker;
    network.model = model;
    network.type = type;
    network.supplier = supplier;
    network.order = order;

    await network.save();

    /* const network = await Network.findByIdAndUpdate(
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

    if (!network)
      return res.status(404).json({ message: 'Network no encontrado' }); */

    return res
      .status(201)
      .json({ data: network, message: "Red editada exitosamente" });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};
