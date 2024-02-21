const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const DataModel = require('./models/Schema');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());

const database = mongoose.connect(process.env.DATABASE_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

app.get('/data', async (req, res) => {
  try {
    const data = await DataModel.find();

    if (data && data.length > 0) {
      console.log('Data fetched from MongoDB');
      res.status(200).json({ success: true, data });
    } else {
      console.error('No data found in the database');
      res.status(404).json({ success: false, message: 'No data found in the database' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Error fetching data from the database' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server Running At ${process.env.PORT}`);
});
