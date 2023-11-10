export const checkExists = async (res, entity, entityId, entityType) => {
  const validEntity = await entity.exists({ _id: entityId });
  if (!validEntity) {
    return res
      .status(400)
      .json({ message: `No existe el ${entityType} ingresado` });
  }
};
