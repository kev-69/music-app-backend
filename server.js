const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const DBConnection = require('./config/dbConnection');
// const e = require('cors');


const app = express();
const port = process.env.PORT || 5000;
const host = process.env.HOST || 'localhost';

// middleware
app.use(cors());
app.use(express.json());

// DB connection
DBConnection();

// routes


// listen
app.listen(port, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
