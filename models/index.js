const connectDB = require('../config/database');
const User = require('./user.model');
const Event = require('./event.model');
const Booking = require('./booking.model');

module.exports = {
    initializeDB: connectDB,
    User,
    Event,
    Booking,
};
