const express = require('express');
const mongoose = require('mongoose')

const auth = require("../middleware/auth")

const uploadImage = require("../helper/upload")

const Post = require("../Models/post")
const User = require("../Models/user");


const Router = express.Router();


//upload-post

Router.post("/upload-post", auth, uploadImage.single("post"), async (req, res) => {
    try {
        const { caption } = req.body;
        const userId = req.user_id;
        if (!req.file) {
            return res.status(400).json({ message: "please upload image!" })
        }
        console.log(userId, req.file.path, caption)
        const post = new Post({
            userId,
            postImage: req.file.path,
            caption
        });

        const upload = await post.save();

        if (!upload) {
            return res.status(500).json({ message: "Server error" })
        }

        res.status(200).json({ message: "Post uploaded", upload })

    } catch (error) {
        res.status(500).json({ error: error })
    }
})


//get-self-posts

Router.get("/get-self-posts", auth, async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.user_id })
        if (!posts) {
            return res.status(400).json({ message: "No-Post found" })
        }
        res.status(200).json({ message: "Posts Found", posts })
    } catch (error) {
        return res.status(500).json({ error: error })
    }
})

//delete-posts
Router.delete("/delete-post", auth, async (req, res) => {
    try {
        const { id } = req.body;
        const remove = await Post.findOneAndDelete(
            {
                _id: id, userId: req.user_id
            }
        )
        if (!remove) {
            return res.status(404).json({ message: "Not found" })
        }
        res.status(200).json({ message: "removed", remove })
    } catch (error) {
        return res.status(500).json({ error: error })
    }
})

//update-post (caption update only)

Router.patch("/update-post", auth, async (req, res) => {
    try {
        const { id, caption } = req.body;
        const update = await Post.findOneAndUpdate({ _id: id, userId: req.user_id }, { $set: { caption } })
        if (!update) {
            return res.status(400).json({ message: "Not found" })
        }
        res.status(200).json({ message: "updated", update });
    } catch (error) {
        return res.status(500).json({ error: error })
    }
})


//get-friends-posts 


Router.get("/get-friends-posts", auth, async (req, res) => {
    try {


        const posts = await User.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(req.user_id)
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "friends",
                    foreignField: "userId",
                    as: "posts"
                }
            },
            {
                $project: {
                    "posts": 1,
                    _id: 0
                }
            }
        ])

        res.status(200).json(posts)

    } catch (error) {
        res.status(500).json({ error: error })
    }
})



module.exports = Router;