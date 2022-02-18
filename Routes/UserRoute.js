const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")



const Router = express.Router();



//auth middile-ware
const auth = require('../middleware/auth');



//userModel
const User = require('../Models/user');


//registeration of user


Router.post("/register", async (req, res) => {
    try {
        const { name, email, password, address } = req.body;
        console.log(req.body)

        const checkUser = await User.findOne({ email: email });
        if (checkUser) {
            return res.status(402).json({ message: "User already Exists" })
        }
        console.log(checkUser)

        //hasing the password
        const hash = await bcrypt.hash(password, 10);
        console.log(hash)

        const user = new User({
            name,
            email,
            password: hash,
            address
        })
        const newUser = await user.save()


        res.status(200).json({ message: "User added Succesfully", newUser })



    } catch (error) {
        return res.status(500).json({ error: error })
    }
})


//login route for user


Router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)

        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ message: "Wrong credentials" });
        }
        console.log(user)

        const result = await bcrypt.compare(password, user.password);
        console.log(result)
        if (!result) {
            return res.status(400).json({ message: "Wrong credentials" });
        }
        console.log(process.env.JWT_SECRET_KEY)

        // setting JWT Token

        jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "15d"
            },
            ((error, token) => {
                if (error) {
                    return res.status(500).json({ message: "Server error" })
                }
                res.status(200).json({ message: "Login Successfully", token })
            })
        )


    } catch (error) {
        return res.status(500).json({ error: error })
    }
})


//edit profile 

Router.patch("/edit-profile", auth, async (req, res) => {
    try {
        const _id = req.user_id;
        const { name, address } = req.body

        console.log(_id)
        const user = await User.findByIdAndUpdate(_id, { $set: { name, address } })

        if (!user) {
            return res.status(500).json({ message: "Server error" })
        }

        res.status(200).json({ message: "profile updated Successfully" })

    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//search user by city,state

Router.get("/search-user", auth, async (req, res) => {
    try {
        const { city, state } = req.body;
        filter = [
            {
                $match: { $or: [{ "address.city": city }, { "address.state": state }] }
            },
            {
                $project: { "password": 0, "__v": 0 }
            }
        ]


        const user = await User.aggregate([filter]);

        if (user.length < 1) {
            return res.status(400).json({ message: "No Result" });
        }


        res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({ error: error })
    }
})

//get user by id

Router.get("/user", auth, async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            var user = await User.findById(req.user_id, { "password": 0, })
        }
        else {
            var user = await User.findById(id, { "password": 0 })
        }
        if (!user) {
            return res.status(400).json({ message: "No Result" });
        }
        res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: error })
    }
})





module.exports = Router;