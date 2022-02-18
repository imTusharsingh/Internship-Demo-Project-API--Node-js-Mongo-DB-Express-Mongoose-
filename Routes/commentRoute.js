const express = require("express");
const mongoose = require("mongoose")
const auth = require('../middleware/auth')
const Post = require('../Models/post')
const Router = express.Router();

//add comment

Router.post("/add-comment", auth, async (req, res) => {
    try {
        const { comment, id } = req.body;
        const addComment = await Post.findByIdAndUpdate(id, { $push: { comments: { userId: req.user_id, comment } } }, { new: true })
        if (!addComment) {
            return res.status(400).json({ message: "Not Found" })
        }
        res.status(200).json({ message: "Commented added", addComment })
    } catch (error) {
        return res.status(500).json({ error: error })
    }
})


//remove comment

Router.post("/remove-comment", auth, async (req, res) => {
    try {
        const { post_id, comment_id } = req.body;
        const check = await Post.find({ "comments._id": comment_id, "comments.userId": req.user_id })
        if (check.length === 0) {
            return res.status(400).json({ message: "Not authorized" })
        }
        const removeComment = await Post.findByIdAndUpdate(post_id, { $pull: { comments: { userId: req.user_id } } }, { new: true })
        if (!removeComment) {
            return res.status(500).json({ message: "Server Error" })
        }
        res.status(200).json({ message: "comment remove" })

    } catch (error) {
        return res.status(500).json({ error: error })
    }
})

// edit comment 

Router.patch("/edit-comment", auth, async (req, res) => {
    try {
        const { comment_id, comment } = req.body;
        const check = await Post.find({ "comments._id": comment_id, "comments.userId": req.user_id })
        if (check.length === 0) {
            return res.status(400).json({ message: "Not authorized" })
        }

        const editComment = await Post.updateOne(
            {
                "comments._id": comment_id
            },
            {
                $set: { "comments.$.comment": comment }
            }
        )
        if (!editComment) {
            return res.status(500).json({ message: "Server error" })
        }
        res.json({ message: "comment edited" })


    } catch (error) {
        return res.status(500).json({ error: error })
    }
})

module.exports = Router;