require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db'); 
const models = require('./models/models');
const cors = require('cors');
const userRouter = require('./routes/userRouter');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');

const PORT = process.env.PORT || 7000;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', userRouter);

//Error handling, last Middleware
app.use(errorHandler);

// app.get('/', (req, res) => { 
//     res.status(200).json({ message: 'WORKING' });
// })

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