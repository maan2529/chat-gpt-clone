const jwt = require('jsonwebtoken')
const User = require('../../models/user.model')
const redis = require('../../db/redis')

async function userAuth(req, res, next) {
    try {
        const token = req.cookies?.token

        if (!token) {
            req.status(401).json({
                message: "Unauthorize"
            })
        }


        const decodedData = jwt.verify(token, process.env.JWT_SECRET)
        const isBlacklisted = await redis.get(`blacklist:${token}`)
        
        if (!isBlacklisted) {
            req.status(401).json({
                message: "Unauthorize"
            })
        }
        const redisUser = await redis.get(`user:${decodedData._id}`)

        if (redisUser) {
            req.user = JSON.parse(redisUser)
            return next()
        }

        const user = User.findById(decodedData._id)

        if (!user) {
            res.status(404).json({
                message: "Unauthorize"
            })
        }

        redisUser.setex(`user:${user._id}`, 6000, JSON.stringify(user))

        req.user = user;
        return next();
    } catch (error) {
        throw Error("auth error " + error);
    }

}

module.exports = {
    userAuth
}