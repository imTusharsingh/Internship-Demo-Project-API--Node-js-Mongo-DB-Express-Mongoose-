const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv').config();



const app = express();

const PORT = process.env.PORT || 8080;

//Data-base connection
require("./DB/connect");

//cors
app.use(cors())

//body-parsing
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('hello')
})

//User-Routes
app.use("/", require("./Routes/UserRoute"))
//friend-Routes
app.use("/", require("./Routes/FrinedRoute"))
//Post-Routes
app.use("/", require("./Routes/PostRoute"))
//like-Routes
app.use("/", require("./Routes/likeRoute"))
//comment-Routes
app.use("/", require("./Routes/commentRoute"))

app.listen(PORT, () => {
    console.log(`server is running at ${PORT}`)
})