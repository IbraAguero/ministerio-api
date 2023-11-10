export const transformType = (type) => {
  if (type === "monitores") {
    return "monitor";
  } else if (type === "impresoras") {
    return "impresora";
  } else if (type === "perifericos") {
    return "periferico";
  } else if (type === "redes") {
    return "red";
  } else if (type === "cpu") {
    return "cpu";
  } else if (type === "ram") {
    return "ram";
  } else if (type === "hdd") {
    return "hdd";
  } else if (type === "placa-madre") {
    return "motherBoard";
  } else if (type === "tarjeta-grafica") {
    return "graficCard";
  } else {
    throw new Error("Tipo de fabricante invalido");
  }
};
