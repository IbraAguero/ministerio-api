import mongoose from "mongoose";

const makerSchema = new mongoose.Schema({
  name: {
    type: String,
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
  models: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Model",
    },
  ],
});

makerSchema.index({ name: 1, type: 1 }, { unique: true });

makerSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model("Maker", makerSchema);
