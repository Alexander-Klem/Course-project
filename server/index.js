require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db'); 
const cors = require('cors');
const userRouter = require('./routes/userRouter');
const inventoryRouter = require('./routes/inventoryRouter');
const itemRouter = require('./routes/itemRouter');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');

const PORT = process.env.PORT || 7000;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', userRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/items', itemRouter);

//Error handling, last Middleware
app.use(errorHandler);

const start = async () => { 
    try {
        await sequelize.authenticate();
        console.log('Connection established successfully.');
        await sequelize.sync();
        // await sequelize.sync({ force: true });
        app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
    } catch (error) { 
        console.error('Unable to connect:', error.message);
    }
}

start();