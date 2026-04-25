const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    totalTickets: {
        type: Number,
        required: true,
    },
    availableTickets: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
    collection: 'events'
});

module.exports = mongoose.model('Event', eventSchema);
