module.exports = {
    STATUS: {
        SUCCESS: 'success',
        ERROR: 'error'
    },
    AUTH: {
        TOKEN_REQUIRED: 'Authorization token is required',
        INVALID_TOKEN: 'Invalid or expired token',
        ACCESS_DENIED: 'Access denied. You do not have permission for this action.',
        EMAIL_EXISTS: 'Email is already registered',
        INVALID_CREDENTIALS: 'Invalid email or password',
        LOGIN_SUCCESS: 'Login successful',
        REGISTER_SUCCESS: 'User registered successfully'
    },
    EVENT: {
        NOT_FOUND: 'Event not found',
        CREATED: 'Event created successfully',
        UPDATED: 'Event updated successfully',
        DELETED: 'Event successfully deleted',
        PAST_DATE_CREATE: 'You cannot create an event in the past.',
        PAST_DATE_UPDATE: 'You cannot reschedule an event to the past.',
        BELOW_BOOKED_TICKETS: 'Cannot reduce total tickets below amount already booked',
        EXPIRED_BOOKING: 'This event has already expired and cannot be booked.',
        NOT_ENOUGH_TICKETS: 'Not enough tickets available'
    },
    BOOKING: {
        ALREADY_BOOKED: 'You have already booked tickets for this event.',
        SUCCESS: 'Tickets booked successfully'
    },
    COMMON: {
        INTERNAL_SERVER_ERROR: 'Internal Server Error'
    }
};
