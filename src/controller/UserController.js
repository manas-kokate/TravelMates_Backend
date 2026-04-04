import User from "../models/user.js";
import cloudinary from "../config/cloudinary.js";
import uploadFromBuffer from "../utils/uploadFromBuffer.js";
import env from "dotenv";
env.config();


export const getCurrentLoggedInUser = async (req, res) => {
    try {
        const id = req.id;
        const user = await User.findById(req.id).select("-password -refreshToken");
        if (!user) {
            return res.send({
                status: 404,
                message: 'User not found..'
            })
        }
        return res.send({
            status: 200,
            user: user
        })
    } catch (error) {
        return res.send({
            status: 500,
            message: 'Internal Server Error..' + error.message,
        })
    }
}

export const updateUserProfile = async (req, res) => {
    const { name, email } = req.body;
    try {
        if (!name && !email) {
            return res.send({
                status: 400,
                message: "At least one field is required to update the profile. Name or email."
            })
        }
        const user = await User.findById(req.id);
        if (!user) {
            return res.send({
                status: 404,
                message: 'User not found..'
            })
        }
        if (name) user.username = name;
        if (email) user.email = email;
        await user.save();
        return res.send({
            status: 200,
            message: "Profile updated successfully..",
            user
        })
    } catch (error) {
        return res.send({
            status: 500,
            message: 'Internal Server Error..' + error.message,
        })
    }
}

export const uploadProfilePic = async (req, res) => {
    try {
        const user = await User.findById(req.id);
        if (!user) {
            return res.send({
                status: 404,
                message: "User not found.."
            })
        }
        if (!req.file) {
            return res.send({
                status: 400,
                message: "No file uploaded.."
            })
        }
        const result = await uploadFromBuffer(req.file.buffer);
        user.profilePic = result.secure_url;
        await user.save();
        return res.send({
            status: 200,
            message: "Profile picture uploaded successfully..",
            profilePic: user.profilePic
        })
    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal Server Error.." + error.message
        })
    }
}

export const searchUsers = async (req, res) => {
    try {
        let { location, interests, page, limit, name } = req.query;
        if (req.query.location) location = req.query.location;
        if (req.query.interests) interests = req.query.interests;
        if (req.query.name) name = req.query.name;
        page = req.query.page ? parseInt(page) : 1;
        limit = req.query.limit ? parseInt(limit) : 1;
        const query = {};
        if (name) {
            query.username = { $regex: name, $options: "i" }
        }
        if (location) {
            query.location = { $regex: location, $options: "i" }
        }
        if (interests.length > 0) {
            const interestsArray = interests.split(',').map(interest => interest.trim());
            query.interests = {
                $in: interestsArray
            };
        }

        query._id = { $ne: req.id }

        const skip = (page - 1) * limit;

        const users = await User.find(query).select("-password -refreshtoken").skip(skip).limit(limit);

        const totalUsers = await User.countDocuments(query);

        return res.send({
            status: 200,
            message: "Users fetched successfully",
            users,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
            totalUsers,
        })
    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal Server Error.." + error.message
        })
    }
}