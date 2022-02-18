const express = require("express");
const auth = require("../middleware/auth");
const { find } = require("../Models/friend");

const Router = express.Router();

const Friend = require('../Models/friend');
const User = require('../Models/user');

//send friendrequest
Router.post('/send-friend-request', auth, async (req, res) => {
    try {
        const id = req.user_id;
        const { recieverId } = req.body;


        const isAlreadyFriend = await User.find({ friends: recieverId })
        if (isAlreadyFriend.length != 0) {
            return res.status(400).json({ message: "already friend" })
        }
        const check = await Friend.find({ $or: [{ senderId: id, recieverId }, { recieverId: id, senderId: recieverId }] })
        if (check.length != 0) {
            return res.status(400).json({ message: "can not send request again" })
        }


        if (recieverId === id) {
            return res.status(401).json({ message: "Can not Send request to same id" })
        }

        const request = new Friend({
            senderId: id,
            recieverId,
        })

        const newRequest = await request.save();
        if (!newRequest) {
            return res.status(500).json({ message: "Server error" })
        }

        res.status(200).json({ message: "request sent", newRequest })


    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//get friend Request list

Router.get('/get-friend-request', auth, async (req, res) => {
    try {
        const id = req.user_id;
        const requests = await Friend.find({ recieverId: id, isApporved: false });
        if (!requests) {
            return res.status(500).json({ message: "Server error" })
        }
        res.status(200).json({ requests });

    } catch (error) {
        res.status(500).json({ error: error })
    }
})


//get friend request sent list

Router.get('/get-friend-request-sent', auth, async (req, res) => {
    try {
        const id = req.user_id;
        const requests = await Friend.find({ senderId: id, isApporved: false });
        if (!requests) {
            return res.status(500).json({ message: "Server error" })
        }
        res.status(200).json({ requests });

    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//get friends list

Router.get('/get-friends', auth, async (req, res) => {
    try {
        const id = req.user_id;
        const requests = await User.findById(id, { password: 0, __v: 0, }).populate('friends', ["name", "email", "address"])
        const friend = requests.friends;
        // const requests = await Friend.find({ recieverId: id, isApporved: true });
        if (!requests) {
            return res.status(500).json({ message: "Server error" })
        }
        res.status(200).json(requests);

    } catch (error) {
        res.status(500).json({ error: error })
    }
})


//accept friendRequest

Router.patch('/accept-friend-request', auth, async (req, res) => {
    try {

        const { id } = req.body

        const requests = await Friend.findOneAndUpdate({ _id: id, recieverId: req.user_id }, { $set: { isApporved: true } });
        if (!requests) {
            return res.status(400).json({ message: "Not found" })
        }

        const addFriendInOnlineUser = await User.findByIdAndUpdate(req.user_id, { $push: { friends: requests.senderId } })
        const addFriendInSenderUser = await User.findByIdAndUpdate(requests.senderId, { $push: { friends: requests.recieverId } })
        const deleterequest = await Friend.findByIdAndDelete(id)


        res.status(200).json({ message: "accepted" });

    } catch (error) {
        res.status(500).json({ error: error })
    }
});

//reject friendRequest

Router.delete('/reject-friend-request', auth, async (req, res) => {
    try {
        const { id } = req.body;
        const remove = await Friend.findOneAndDelete(
            {
                _id: id, recieverId: req.user_id
            }
        )
        if (!remove) {
            return res.status(404).json({ message: "Not found" })
        }
        res.status(200).json({ message: "rejected", remove })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//remove friend-request

Router.delete('/remove-friend-request', auth, async (req, res) => {
    try {
        const { id } = req.body;
        const remove = await Friend.findOneAndDelete(
            {
                _id: id, senderId: req.user_id
            }
        )
        // const removeFromList=await User.findByIdAndUpdate()
        if (!remove) {
            return res.status(404).json({ message: "Not found" })
        }
        res.send({ message: "removed", remove })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//remove friend

Router.patch('/remove-friend', auth, async (req, res) => {
    try {
        const { id } = req.body;
        const check = await User.find({ _id: req.user_id, friends: id })
        if (check.length === 0) {
            return res.status(400).json({ message: "Not Found" })
        }
        const removeFromUser = await User.findByIdAndUpdate(req.user_id, { $pull: { "friends": id } });
        const removeFromOtherUser = await User.findByIdAndUpdate(id, { $pull: { "friends": req.user_id } })
        res.status(200).json({ message: "removed" })
    } catch (error) {
        return res.status(500).json({ error: error })
    }
})








module.exports = Router