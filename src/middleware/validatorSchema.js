export const validateSchema = (schema) => (req, res, next) => {
  try {
    const validation = schema.safeParse(req.body);
    if (validation.error) {
      return res
        .status(400)
        .json({ error: JSON.parse(validation.error.message) });
    }
    req.validData = validation.data;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};
