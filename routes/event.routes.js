const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const validate = require('../middleware/validator.middleware');
const authorize = require('../middleware/user.middleware');
const { createEventSchema, updateEventSchema, bookEventSchema } = require('../validators/event.validator');

router.get('/events', authorize(['admin', 'user']), eventController.getAllEvents);
router.get('/events/:id', authorize(['admin', 'user']), eventController.getEventById);
router.post('/events', authorize(['admin']), validate(createEventSchema), eventController.createEvent);
router.patch('/events/:id', authorize(['admin']), validate(updateEventSchema), eventController.updateEvent);
router.delete('/events/:id', authorize(['admin']), eventController.deleteEvent);

router.post('/events/:id/book', authorize(['user']), validate(bookEventSchema), eventController.bookEvent);

module.exports = router;
