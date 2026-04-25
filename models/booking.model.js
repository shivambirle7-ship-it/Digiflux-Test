const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    ticketsBooked: {
        type: Number,
        required: true,
        default: 1,
    },
}, {
    timestamps: true,
    collection: 'events_booking'
});

module.exports = mongoose.model('Booking', bookingSchema);
