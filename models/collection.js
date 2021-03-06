const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const collectionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    numbers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Number'
        }
    ],
});

module.exports = mongoose.model('Collection', collectionSchema);