const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const DataModel = require('./models/Schema');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const database = mongoose.connect(process.env.DATABASE_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });


app.get('/fetch-and-store-data', async (req, res) => {
  try {
    const response = await axios.get('http://20.121.141.248:5000/assignment/feb/sde_fe');
    const responseData = response.data;

    if (Array.isArray(responseData.data)) {

      await DataModel.insertMany(responseData.data);
      console.log('Data inserted into MongoDB');
      res.status(200).json({ success: true, message: 'Data inserted into MongoDB' });
    } else {
      console.error('Data property is not an array:', responseData.data);
      res.status(500).json({ success: false, message: 'Error: Data property is not an array' });
    }
  } catch (error) {
    console.error('Error fetching and storing data:', error);
    res.status(500).json({ success: false, message: 'Error fetching and storing data' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server Running At ${process.env.PORT}`);
});
