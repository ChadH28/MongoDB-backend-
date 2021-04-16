const mongoose = require('mongoose');

const InfoSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    id_number: {
        type: String,

    },
    blood_type: {
        type: String,
    },
    gender: {
        type: String,
    },
    date: {
        type: String,
        default: Date.now
    },
});

module.exports = mongoose.model('info', InfoSchema)

// if getting a db error look at the schema and schema exports