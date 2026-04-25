const Joi = require('joi');

const createEventSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional().allow(''),
    totalTickets: Joi.number().integer().min(1).required(),
    date: Joi.date().iso().required(),
});

const updateEventSchema = Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional().allow(''),
    totalTickets: Joi.number().integer().min(1).optional(),
    date: Joi.date().iso().optional(),
});

const bookEventSchema = Joi.object({
    tickets: Joi.number().integer().min(1).required(),
});

module.exports = {
    createEventSchema,
    updateEventSchema,
    bookEventSchema,
};
