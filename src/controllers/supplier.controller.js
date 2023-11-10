import Supplier from '../models/supplier.model.js';
import Printer from '../models/printer.model.js';

export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    return res.json(suppliers);
  } catch (error) {
    return res.status(500).json({ message: 'Algo salio mal' });
  }
};
export const getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier)
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    return res.json(supplier);
  } catch (error) {
    return res.status(404).json({ message: 'Proveedor no encontrado' });
  }
};
export const createSupplier = async (req, res) => {
  try {
    const { name, color } = req.validData;

    const supplierFound = await Supplier.findOne({ name });
    if (supplierFound)
      return res.status(400).json({ message: 'El nombre ya esta en uso' });

    const newSupplier = new Supplier({
      name,
      color,
      //user: req.user.id,
    });
    const savedSupplier = await newSupplier.save();
    return res.json(savedSupplier);
  } catch (error) {
    return res.status(500).json({ message: 'Algo salio mal' });
  }
};

export const deleteSupplier = async (req, res) => {
  const id = req.params.id;
  const isUsed = await isSupplierInUse(id);

  if (isUsed) {
    return res.status(400).json({
      message:
        'No puedes eliminar este proveedor porque está en uso en alguna categoría',
    });
  }

  const supplier = await Supplier.findByIdAndDelete(id);
  if (!supplier)
    return res.status(404).json({ message: 'Proveedor no encontrado' });
  return res.sendStatus(204);
};

export const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.validData,
      {
        new: true,
      }
    );

    if (!supplier)
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    return res.json(supplier);
  } catch (error) {
    return res.status(404).json({ message: 'Proveedor no encontrado' });
  }
};

async function isSupplierInUse(id) {
  const printerExists = await Printer.exists({ supplier: id });
  //const monitorExists = await Monitor.exists({ supplier: id });
  //const computerExists = await Computer.exists({ supplier: id });
  //const peripheralExists = await Peripheral.exists({ supplier: id });

  return printerExists; //|| monitorExists || computerExists || peripheralExists;
}
