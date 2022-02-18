const mongoose = require('mongoose');

const Schema = mongoose.Schema;


//likeSchema

const likeSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER",
        required: true
    }
})


//commentSchema

const commentSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER",
        required: true
    },
    comment: {
        type: String,
        required: [true, 'Enter Your Text!']
    }
})



//postSchema

const postSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER",
        required: true
    },
    postImage: {
        type: String,
        required: [true, 'Please Upload the Image!']
    },
    caption: {
        type: String
    },
    likes: [likeSchema],
    comments: [commentSchema]

})

module.exports = mongoose.model("POST", postSchema);