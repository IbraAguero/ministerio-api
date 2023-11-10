import mongoose from "mongoose";

const typeSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  type: {
    type: String,
    enum: [
      "impresora",
      "monitor",
      "periferico",
      "red",
      "cpu",
      "ram",
      "hdd",
      "motherBoard",
      "graficCard",
    ],
    required: true,
  },
});

typeSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model("Type", typeSchema);
