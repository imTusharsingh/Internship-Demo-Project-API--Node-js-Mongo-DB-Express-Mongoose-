const jwt = require('jsonwebtoken');


//Checking JWT Token in header


const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user_id = decoded._id;
        console.log(decoded)
        next();

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" })
    }

}

module.exports = auth;