import Printer from '../models/printer.model.js';
import State from '../models/state.model.js';

export const getStates = async (req, res) => {
  try {
    const states = await State.find();
    return res.json(states);
  } catch (error) {
    return res.status(500).json({ message: 'Algo salio mal' });
  }
};
export const getState = async (req, res) => {
  try {
    const state = await State.findById(req.params.id);
    if (!state)
      return res.status(404).json({ message: 'Estado no encontrado' });
    return res.json(state);
  } catch (error) {
    return res.status(404).json({ message: 'Estado no encontrado' });
  }
};
export const createState = async (req, res) => {
  try {
    const { name, color } = req.validData;
    const newState = new State({
      name,
      color,
      //user: req.user.id,
    });
    const savedState = await newState.save();
    return res.json(savedState);
  } catch (error) {
    return res.status(500).json({ message: 'Algo salio mal' });
  }
};
export const deleteState = async (req, res) => {
  try {
    const id = req.params.id;
    const isUsed = await isStateInUse(id);

    if (isUsed) {
      return res.status(400).json({
        message:
          'No puedes eliminar este estado porque está en uso en alguna categoría',
      });
    }

    const state = await State.findByIdAndDelete(id);
    if (!state)
      return res.status(404).json({ message: 'Estado no encontrado' });
    return res.sendStatus(204);
  } catch (error) {
    return res.status(404).json({ message: 'Estado no encontrado' });
  }
};
export const updateState = async (req, res) => {
  try {
    const state = await State.findByIdAndUpdate(req.params.id, req.validData, {
      new: true,
    });

    if (!state)
      return res.status(404).json({ message: 'Estado no encontrado' });
    return res.json(state);
  } catch (error) {
    return res.status(404).json({ message: 'Estado no encontrado' });
  }
};

async function isStateInUse(id) {
  const printerExists = await Printer.exists({ state: id });
  //const monitorExists = await Monitor.exists({ state: id });
  //const computerExists = await Computer.exists({ state: id });
  //const peripheralExists = await Peripheral.exists({ state: id });

  return printerExists; //|| monitorExists || computerExists || peripheralExists;
}
