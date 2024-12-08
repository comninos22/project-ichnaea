import mongoose from 'mongoose';

const DatasetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  fileHash: { type: String, required: true },
  commitHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Dataset = mongoose.model('Dataset', DatasetSchema);
