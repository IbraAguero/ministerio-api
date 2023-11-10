import mongoose from "mongoose";

const modelSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  type: {
    type: String,
    enum: ["impresora", "monitor", "periferico", "red"],
    required: true,
  },
  maker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Maker",
    required: true,
  },
});

modelSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model("Model", modelSchema);
