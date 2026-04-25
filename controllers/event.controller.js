const eventService = require('../services/event.service');
const MSG = require('../constants/messages');

const createEvent = async (req, res) => {
    try {
        const data = req.body;

        const minDateCheck = new Date();
        minDateCheck.setHours(0, 0, 0, 0);

        if (new Date(data.date) < minDateCheck) {
            return res.status(400).json({ status: MSG.STATUS.ERROR, message: MSG.EVENT.PAST_DATE_CREATE });
        }

        data.availableTickets = data.totalTickets;
        const event = await eventService.createEvent(data);
        res.status(201).json({ status: MSG.STATUS.SUCCESS, message: MSG.EVENT.CREATED, data: event });
    } catch (error) {
        res.status(500).json({ status: MSG.STATUS.ERROR, message: error.message });
    }
};

const getAllEvents = async (req, res) => {
    try {
        const now = new Date();
        const filter = { date: { $gte: now } };

        const events = await eventService.getAllEvents(filter);
        res.status(200).json({ status: MSG.STATUS.SUCCESS, data: events });
    } catch (error) {
        res.status(500).json({ status: MSG.STATUS.ERROR, message: error.message });
    }
};

const getEventById = async (req, res) => {
    try {
        const event = await eventService.findEventById(req.params.id);
        if (!event) {
            return res.status(404).json({ status: MSG.STATUS.ERROR, message: MSG.EVENT.NOT_FOUND });
        }
        res.status(200).json({ status: MSG.STATUS.SUCCESS, data: event });
    } catch (error) {
        res.status(500).json({ status: MSG.STATUS.ERROR, message: error.message });
    }
};

const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const event = await eventService.findEventById(id);
        if (!event) {
            return res.status(404).json({ status: MSG.STATUS.ERROR, message: MSG.EVENT.NOT_FOUND });
        }

        if (data.date) {
            const minDateCheck = new Date();
            minDateCheck.setHours(0, 0, 0, 0);
            if (new Date(data.date) < minDateCheck) {
                return res.status(400).json({ status: MSG.STATUS.ERROR, message: MSG.EVENT.PAST_DATE_UPDATE });
            }
        }

        if (data.totalTickets !== undefined) {
            const difference = data.totalTickets - event.totalTickets;
            data.availableTickets = event.availableTickets + difference;

            if (data.availableTickets < 0) {
                return res.status(400).json({ status: MSG.STATUS.ERROR, message: MSG.EVENT.BELOW_BOOKED_TICKETS });
            }
        }

        Object.assign(event, data);
        await eventService.saveEventDetails(event);

        res.status(200).json({ status: MSG.STATUS.SUCCESS, message: MSG.EVENT.UPDATED, data: event });
    } catch (error) {
        res.status(500).json({ status: MSG.STATUS.ERROR, message: error.message });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const event = await eventService.findEventById(req.params.id);
        if (!event) {
            return res.status(404).json({ status: MSG.STATUS.ERROR, message: MSG.EVENT.NOT_FOUND });
        }

        await eventService.deleteEventObj(event);
        res.status(200).json({ status: MSG.STATUS.SUCCESS, message: MSG.EVENT.DELETED });
    } catch (error) {
        res.status(500).json({ status: MSG.STATUS.ERROR, message: error.message });
    }
};

const bookEvent = async (req, res) => {
    try {
        const { tickets } = req.body;
        const eventId = req.params.id;
        const userId = req.user.id;

        const targetEvent = await eventService.findEventById(eventId);
        if (!targetEvent) {
            return res.status(404).json({ status: MSG.STATUS.ERROR, message: MSG.EVENT.NOT_FOUND });
        }

        if (new Date(targetEvent.date) < new Date()) {
            return res.status(400).json({ status: MSG.STATUS.ERROR, message: MSG.EVENT.EXPIRED_BOOKING });
        }

        const existingBooking = await eventService.findExistingBooking(userId, eventId);
        if (existingBooking) {
            return res.status(400).json({ status: MSG.STATUS.ERROR, message: MSG.BOOKING.ALREADY_BOOKED });
        }

        const eventParams = await eventService.atomicallyDecrementTickets(eventId, tickets);
        if (!eventParams) {
            return res.status(400).json({ status: MSG.STATUS.ERROR, message: MSG.EVENT.NOT_ENOUGH_TICKETS });
        }

        const booking = await eventService.createNewBooking({
            userId,
            eventId,
            ticketsBooked: tickets,
        });

        res.status(201).json({
            status: MSG.STATUS.SUCCESS,
            message: MSG.BOOKING.SUCCESS,
            data: booking,
        });
    } catch (error) {
        res.status(500).json({ status: MSG.STATUS.ERROR, message: error.message });
    }
};

module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    bookEvent
};
