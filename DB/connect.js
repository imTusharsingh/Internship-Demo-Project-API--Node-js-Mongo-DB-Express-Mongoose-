const mongoose = require('mongoose')


//mongoose connection


mongoose.connect(process.env.DB_URL, (err) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log("database connected succesfuly")
    }
})

module.exports = mongoose