const express = require('express');

const auth = require('../middleware/auth');
const Post = require('../Models/post')
const Router = express.Router();

//like the post
Router.post("/like", auth, async (req, res) => {
    try {
        const { id } = req.body;
        const check = await Post.find({ _id: id, "likes.userId": req.user_id })
        if (check.length != 0) {
            return res.status(500).json({ message: "Already liked" })
        }
        const like = await Post.findByIdAndUpdate(id, { $push: { likes: { userId: req.user_id } } })
        if (!like) {
            return res.status(400).json({ message: "Not Found" })
        }
        res.status(200).json({ message: "likes added" })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//dislike the post
Router.post("/dislike", auth, async (req, res) => {
    try {
        const { id } = req.body;
        const check = await Post.find({ _id: id, "likes.userId": req.user_id })
        if (check.length === 0) {
            return res.status(400).json({ message: "Not authorized" })
        }
        const unlike = await Post.findByIdAndUpdate(id, { $pull: { likes: { userId: req.user_id } } })
        if (!unlike) {
            return res.status(500).json({ message: "Server Error" })
        }
        res.status(200).json({ message: "like remove" })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

module.exports = Router