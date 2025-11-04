const jwt = require('jsonwebtoken')
const User = require('../../models/user.model')
const redis = require('../../db/redis')

async function userAuth(req, res, next) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            res.status(401).json({
                message: "Unauthorize"
            })
            return;
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET)
        const isBlacklisted = await redis.get(`blacklist:${token}`)

        if (isBlacklisted) {
            return res.status(401).json({
                message: "Unauthorize from redis"
            })
        }
        const redisUser = await redis.get(`user:${decodedData.id}`)

        if (redisUser) {
            req.user = JSON.parse(redisUser)
            return next()
        }
        
        const user = await User.findById(decodedData.id)

        if (!user) {
            res.status(401).json({
                message: "Unauthorize"
            })
            return;
        }

        await redis.setex(`user:${user._id}`, 60 * 60 * 24, JSON.stringify(user))

        req.user = user;
        return next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized: Token expired" });
        }
        return next(error)
    }

}

module.exports = {
    userAuth
}