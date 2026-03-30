import User from "../models/user.js";
import cloudinary from "cloudinary";
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
        const result = await cloudinary.v2.uploader.upload({ folder: "travelmates/profilePics", resource_type: "image", file: req.file.path }, async (error, result) => {
            if (error) {
                return res.send({
                    status: 500,
                    message: "Cloudinary upload error.. " + error.message
                })
            }
            user.profilePic = result.secure_url;
            await user.save();
            return res.send({
                status: 200,
                message: "Profile picture uploaded successfully..",
                profilePic: user.profilePic
            })
        })
        result.end(req.file.buffer);
    }
    catch (error) {
        return res.send({
            status: 500,
            message: "Internal Server Error.." + error.message
        })
    }
}