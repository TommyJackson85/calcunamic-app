const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const numberSchema = new Schema(
    {
        value: {
            type: Number,
            required: true
        },
        link: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        dataType: {
            type: String,
            required: true
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        collectionIn: { 
            type: Schema.Types.ObjectId,
            ref: 'Collection'
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Number', numberSchema);