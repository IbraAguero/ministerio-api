import mongoose from 'mongoose';

const changeSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  values: [
    {
      campo: {
        type: String,
      },
      valorAnterior: {
        type: String,
      },
      valorNuevo: {
        type: String,
      },
    },
  ],
});

export default mongoose.model('Change', changeSchema);
