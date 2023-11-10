import Place from '../models/place.model.js';
import Printer from '../models/printer.model.js';

export const getPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    return res.json(places);
  } catch (error) {
    return res.status(500).json({ message: 'Algo salio mal' });
  }
};
export const getPlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Lugar no encontrado' });
    return res.json(place);
  } catch (error) {
    return res.status(404).json({ message: 'Lugar no encontrado' });
  }
};
export const createPlace = async (req, res) => {
  try {
    const { name, supervisor } = req.validData;
    const newPlace = new Place({
      name,
      supervisor,
      //user: req.user.id,
    });
    const savedPlace = await newPlace.save();
    return res.json(savedPlace);
  } catch (error) {
    return res.status(500).json({ message: 'Algo salio mal' });
  }
};
export const deletePlace = async (req, res) => {
  try {
    const id = req.params.id;

    const isUsed = await isPlaceInUse(id);

    if (isUsed) {
      return res.status(400).json({
        message:
          'No puedes eliminar este lugar porque está en uso en alguna categoría',
      });
    }

    const place = await Place.findByIdAndDelete(id);

    if (!place) return res.status(404).json({ message: 'Lugar no encontrado' });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(404).json({ message: 'Lugar no encontrado' });
  }
};

export const updatePlace = async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, req.validData, {
      new: true,
    });

    if (!place) return res.status(404).json({ message: 'Lugar no encontrado' });
    return res.json(place);
  } catch (error) {
    return res.status(404).json({ message: 'Lugar no encontrado' });
  }
};

async function isPlaceInUse(id) {
  const printerExists = await Printer.exists({ place: id });
  //const monitorExists = await Monitor.exists({ place: id });
  //const computerExists = await Computer.exists({ place: id });
  //const peripheralExists = await Peripheral.exists({ place: id });

  return printerExists; //|| monitorExists || computerExists || peripheralExists;
}
