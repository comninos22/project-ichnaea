import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import datasetRoutes from './routes/datasets.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose
  .connect('mongodb://localhost:27017', {dbName:"local"})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Middleware
app.use(bodyParser.json());
app.use('/api', datasetRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
