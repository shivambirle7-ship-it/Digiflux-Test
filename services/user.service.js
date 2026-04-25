const { User } = require('../models');

const findByEmail = async (email) => {
    try {
        return await User.findOne({ email });
    } catch (error) {
        throw error;
    }
};

const createUser = async (data) => {
    try {
        return await User.create(data);
    } catch (error) {
        throw error;
    }
};

module.exports = {
    findByEmail,
    createUser
};
