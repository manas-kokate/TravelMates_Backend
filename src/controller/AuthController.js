import User from "../models/user.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import env from "dotenv";
env.config();

export const registerUser = async (req, res) => {
    try {
        const { username, email, password, location, interests } = req.body;

        // existing user
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        }
        );

        if (existingUser) {
            return res.send({
                status: 201,
                message: "User already exists...!"
            })
        }

        const newUser = new User({
            username,
            email,
            password: password,
            location,
            interests
        })

        await newUser.save();

        return res.send({
            status: 201,
            message: "User registered successfully...!",
            user: newUser
        })

    } catch (error) {
        return res.send({
            status: 500,
            message: error.message
        })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.send({ status: 404, message: "User not found...!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(password, user.password)
            return res.send({
                status: 400,
                message: "Invalid password....!"
            })
        }
        const accessToken = await generateAccessToken(user._id);
        const refreshToken = await generateRefreshToken(user._id);
        user.refreshToken = refreshToken;
        await user.save();

        return res.send({
            status: 200,
            message: "Login successful...!",
            accessToken,
            refreshToken,
            user
        })
    } catch (error) {
        return res.send({
            status: 400,
            message: `Server error. ${error.message}`
        })
    }
}

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.send({ status: 400, message: "Refresh token is required...!" });

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || (user.refreshToken !== refreshToken)) {
            console.log(user.refreshToken !== refreshToken)
            return res.send({ status: 403, message: "Invalid refresh token...!" });
        }

        const newRefreshtoken = await generateRefreshToken(user._id);
        user.refreshToken = newRefreshtoken;
        await user.save();
        const accessToken = await generateAccessToken(user._id);
        return res.send({
            status: 200,
            message: "Token refreshed successfully...!",
            accessToken,
            refreshToken: newRefreshtoken
        })

    } catch (error) {
        return res.send({
            status: 400,
            message: `Server error. ${error.message}`
        })
    }
}