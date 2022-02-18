const mongoose = require('mongoose');

const Schema = mongoose.Schema;


//Friend Requests Schema
const friendSchema = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    recieverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    isApporved: {
        type: Boolean,
        required: true,
        default: false
    }
})

module.exports = mongoose.model("FRIENDREQUEST", friendSchema)