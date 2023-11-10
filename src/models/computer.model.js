import mongoose from "mongoose";

const motherBoardSchema = new mongoose.Schema({
  maker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Maker",
    required: true,
  },
  model: { type: String, trim: true },
  socket: { type: String, trim: true },
});

const cpuSchema = new mongoose.Schema({
  maker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Maker",
    required: true,
  },
  model: { type: String, trim: true },
  frequency: { type: String, trim: true },
  cores: { type: Number, trim: true },
});

const ramSchema = new mongoose.Schema({
  maker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Maker",
    required: true,
  },
  model: { type: String, trim: true },
  capacity: { type: String, trim: true },
  frequency: { type: String, trim: true },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Type",
    required: true,
  },
});

const hddSchema = new mongoose.Schema({
  maker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Maker",
    required: true,
  },
  model: { type: String, trim: true },
  capacity: { type: String, trim: true },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Type",
    required: true,
  },
});

const graphicCardSchema = new mongoose.Schema({
  maker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Maker",
    required: true,
  },
  model: { type: String, trim: true },
  memory: { type: String, trim: true },
});

const computerSchema = new mongoose.Schema(
  {
    nroinventario: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    nroserie: {
      type: String,
      trim: true,
      required: true,
    },
    cpu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CPU",
    },
    motherBoard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MotherBoard",
    },
    ram: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RAM",
    },
    hdd: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HDD",
    },
    graphicCard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "graphicCard",
    },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: true,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    order: {
      type: String,
      trim: true,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
    },
    mandated: {
      type: String,
      trim: true,
    },
    changes: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        values: [
          {
            _id: false,
            field: {
              type: String,
            },
            oldValue: {
              type: String,
            },
            newValue: {
              type: String,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Computer = mongoose.model("Computer", computerSchema);
const MotherBoard = mongoose.model("MotherBoard", motherBoardSchema);
const CPU = mongoose.model("CPU", cpuSchema);
const RAM = mongoose.model("RAM", ramSchema);
const HDD = mongoose.model("HDD", hddSchema);
const GraphicCard = mongoose.model("graphicCard", graphicCardSchema);

export { Computer, MotherBoard, CPU, RAM, HDD, GraphicCard };
