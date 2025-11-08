const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("../db/redis")
const isProduction = process.env.NODE_ENV === 'production';


async function registerUser(req, res) {

    const { username, email, password, fullName: { firstName, lastName } } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserAlreadyExists) {
        return res.status(422).json({
            message: "User already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword,
        fullName: {
            firstName,
            lastName
        }
    })

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET, { expiresIn: '7d' })

    // In auth.controller.js login function
    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        domain: isProduction ? '.vercel.app' : undefined
    });

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role
        }
    })
    return
}

async function loginUser(req, res) {

    const { email, password } = req.body;

    const user = await userModel.findOne({
        email
    })

    if (!user) {
        return res.status(401).json({
            message: "Invalid credentials"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid credentials"
        })
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET, { expiresIn: '7d' })

    const redisUser = await redis.setex(`user:${user._id}`, 6000, JSON.stringify(user));

    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        domain: isProduction ? '.vercel.app' : undefined
    });


    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role
        }
    })

    return
}

async function logout(req, res) {
    try {
        const token = req.cookies.token

        if (token) {
            await redis.setex(`blacklist:${token}`, 60 * 60 * 24, "true")
        }

        if (req.user?._id) {
            await redis.del(`user:${req.user._id}`)
        }

        res.clearCookie("token")

        res.status(200).json({
            message: "User logged out successfully"
        })
    } catch (error) {
        console.error("Logout error:", error)
        res.status(500).json({
            message: "Failed to logout"
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    logout
}