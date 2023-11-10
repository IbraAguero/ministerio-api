import Printer from '../models/printer.model.js';
import Place from '../models/place.model.js';
import State from '../models/state.model.js';
import Maker from '../models/maker.model.js';
import Model from '../models/model.model.js';
import Type from '../models/type.model.js';
import Supplier from '../models/supplier.model.js';
import mongoose from 'mongoose';

export const getPrinters = async (req, res) => {
  try {
    const printers = await Printer.find()
      .populate(
        'maker model type place state supplier createdBy',
        'name username email'
      )
      .lean();
    return res.json(printers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getPrinter = async (req, res) => {
  try {
    const id = req.params.id;

    /* if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de fabricante inválido' });
    } */

    const printer = await Printer.findById(id).populate(
      'maker model place state createdBy',
      'name username email'
    );

    if (!printer)
      return res.status(404).json({ message: 'Impresora no encontrada' });
    return res.json(printer);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

export const createPrinter = async (req, res) => {
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

    const validMaker = await Maker.exists({ _id: maker, type: 'impresora' });
    if (!validMaker) {
      return res
        .status(400)
        .json({ message: 'No existe el fabricante ingresado' });
    }

    const validModel = await Model.exists({ _id: model, type: 'impresora' });
    if (!validModel) {
      return res.status(400).json({ message: 'No existe el modelo ingresado' });
    }

    const validType = await Type.exists({ _id: type, type: 'impresora' });
    if (!validType) {
      return res.status(400).json({ message: 'No existe el tipo ingresado' });
    }

    const validState = await State.exists({ _id: state });
    if (!validState) {
      return res.status(400).json({ message: 'No existe el estado ingresado' });
    }

    const validPlace = await Place.exists({ _id: place });
    if (!validPlace) {
      return res.status(400).json({ message: 'No existe el lugar ingresado' });
    }

    const validSuplier = await Supplier.exists({ _id: supplier });
    if (!validSuplier) {
      return res
        .status(400)
        .json({ message: 'No existe el proveedor ingresado' });
    }

    const printerFound = await Printer.findOne({ nroinventario });
    if (printerFound)
      return res
        .status(400)
        .json({ message: 'El nroinventario ya esta en uso' });

    const newPrinter = new Printer({
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
    const savedPrinter = await newPrinter.save();

    return res
      .status(201)
      .json({ data: savedPrinter, message: 'Impresora creada exitosamente' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const deletePrinter = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de fabricante inválido' });
    }

    const printer = await Printer.findByIdAndDelete(id);

    if (!printer)
      return res.status(404).json({ message: 'Impresora no encontrada' });

    return res
      .sendStatus(204)
      .json({ message: 'Impresora eliminada exitosamente!' });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

export const updatePrinter = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de fabricante inválido' });
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

    const validMaker = await Maker.exists({ _id: maker, type: 'impresora' });
    if (!validMaker) {
      return res
        .status(400)
        .json({ message: 'No existe el fabricante ingresado' });
    }

    const validModel = await Model.exists({ _id: model, type: 'impresora' });
    if (!validModel) {
      return res.status(400).json({ message: 'No existe el modelo ingresado' });
    }

    const validType = await Type.exists({ _id: type, type: 'impresora' });
    if (!validType) {
      return res.status(400).json({ message: 'No existe el tipo ingresado' });
    }

    const validState = await State.exists({ _id: state });
    if (!validState) {
      return res.status(400).json({ message: 'No existe el estado ingresado' });
    }

    const validLugar = await Place.exists({ _id: place });
    if (!validLugar) {
      return res.status(400).json({ message: 'No existe el lugar ingresado' });
    }

    const validSuplier = await Supplier.exists({ _id: supplier });
    if (!validSuplier) {
      return res
        .status(400)
        .json({ message: 'No existe el proveedor ingresado' });
    }

    const printerFound = await Printer.findOne({
      nroinventario,
      _id: { $ne: id },
    });
    if (printerFound)
      return res
        .status(400)
        .json({ message: 'El nroinventario ya esta en uso' });

    const printer = await Printer.findById(id);

    if (!printer)
      return res.status(404).json({ message: 'Impresora no encontrada' });

    const change = {
      user: req.userId,
      values: [],
    };

    if (nroinventario !== printer.nroinventario) {
      change.values.push({
        field: 'Nro Inventario',
        oldValue: printer.nroinventario,
        newValue: nroinventario,
      });
      printer.nroinventario = nroinventario;
    }

    if (place !== printer.place.toString()) {
      const oldPlace = await Place.findById(printer.place);
      const newPlace = await Place.findById(place);

      change.values.push({
        field: 'Lugar',
        oldValue: oldPlace.name,
        newValue: newPlace.name,
      });
      printer.place = place;
    }

    if (state !== printer.state.toString()) {
      const oldState = await State.findById(printer.state);
      const newState = await State.findById(state);

      change.values.push({
        field: 'Estado',
        oldValue: oldState.name,
        newValue: newState.name,
      });
      printer.state = state;
    }

    if (mandated !== printer.mandated) {
      change.values.push({
        field: 'Encargado',
        oldValue: printer.mandated,
        newValue: mandated,
      });
      printer.mandated = mandated;
    }

    if (comment !== printer.comment) {
      change.values.push({
        field: 'Comentario',
        oldValue: printer.comment,
        newValue: comment,
      });
      printer.comment = comment;
    }

    if (change.values.length > 0) {
      printer.changes.push(change);
    }

    printer.nroserie = nroserie;
    printer.maker = maker;
    printer.model = model;
    printer.type = type;
    printer.supplier = supplier;
    printer.order = order;

    await printer.save();

    /* const printer = await Printer.findByIdAndUpdate(
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

    if (!printer)
      return res.status(404).json({ message: 'Impresora no encontrada' }); */

    return res
      .status(201)
      .json({ data: printer, message: 'Impresora editada exitosamente' });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};
