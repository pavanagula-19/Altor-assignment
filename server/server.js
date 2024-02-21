const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const bodyParser = require('body-parser'); 
dotenv.config();
const DataModel = require('./models/Schema')

const app = express();
const database = require('./database');
database.db;
app.get('/data', async (req, res) => {
  try {
    const data = await DataModel.find();

    if (data && data.length > 0) {
      console.log('Data fetched from MongoDB');
      res.status(200).json({ data });
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