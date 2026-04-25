require('dotenv').config();
require('express-async-errors');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const { initializeDB } = require('./models');
const userRoutes = require('./routes/user.routes');
const eventRoutes = require('./routes/event.routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/events', eventRoutes);

app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Endpoint not found'
    });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
initializeDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

module.exports = app;
