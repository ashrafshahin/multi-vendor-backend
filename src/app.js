require('dotenv').config()
console.log('dotenv file connected...');

const express = require('express');
const dbConfig = require('./config/dbConfig');
const { registrationController } = require('./controllers/authController');

const app = express()

dbConfig()

app.use(express.json())

app.post('/registration', registrationController);

app.listen(5000, () => {
    console.log('Server Running...');
    
})