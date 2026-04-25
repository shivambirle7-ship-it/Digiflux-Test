const { Event, Booking } = require('../models');

const createEvent = async (data) => {
    return await Event.create(data);
};

const getAllEvents = async (filter = {}) => {
    return await Event.find(filter).sort({ date: 1 });
};

const findEventById = async (id) => {
    return await Event.findById(id);
};

const saveEventDetails = async (event) => {
    return await event.save();
};

const deleteEventObj = async (event) => {
    return await event.deleteOne();
};

const findExistingBooking = async (userId, eventId) => {
    return await Booking.findOne({ userId, eventId });
};

const atomicallyDecrementTickets = async (eventId, ticketsToBook) => {
    return await Event.findOneAndUpdate(
        { _id: eventId, availableTickets: { $gte: ticketsToBook } },
        { $inc: { availableTickets: -ticketsToBook } },
        { new: true }
    );
};

const createNewBooking = async (data) => {
    return await Booking.create(data);
};

module.exports = {
    createEvent,
    getAllEvents,
    findEventById,
    saveEventDetails,
    deleteEventObj,
    findExistingBooking,
    atomicallyDecrementTickets,
    createNewBooking
};
