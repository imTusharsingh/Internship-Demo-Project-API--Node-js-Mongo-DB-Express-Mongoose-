const mongoose = require('mongoose');

const Schema = mongoose.Schema;


//UserSchema
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Your Name!']
    },
    email: {
        type: String,
        required: [true, 'Please Enter Email!'],
        unique: [true, 'Alreday Registered!'],
        match: [/\S+@\S+\.\S+/, 'is invalid!']
    },
    password: {
        type: String,
        required: [true, 'Please Enter Your Password!'],
    },
    friends: [{
        type: mongoose.Types.ObjectId,
        ref: 'USER'
    }],
    address: {
        line1: {
            type: String,
            required: [true, 'Please Enter Your Address!']
        },
        line2: {
            type: String
        },
        city: {
            type: String,
            required: [true, 'Please Enter Your City!']
        },
        state: {
            type: String,
            required: [true, 'Please Enter Your State!']
        }
    }
})

module.exports = mongoose.model("USER", userSchema);