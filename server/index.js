require('dotenv').config();
const express = require('express');
const sequelize = require('./db'); 


const PORT = process.env.PORT || 5000;

const app = express();

const start = async () => { 
    try {
        await sequelize.authenticate();
        console.log('Connection established successfully.');
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
    } catch (error) { 
        console.error('Unable to connect:', error);
    }
}

start();