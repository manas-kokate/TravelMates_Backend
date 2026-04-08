import User from "../models/user.js";
import cloudinary from "../config/cloudinary.js";
import uploadFromBuffer from "../utils/uploadFromBuffer.js";
import env from "dotenv";
import Connection from "../models/connection.js";
import Message from "../models/message.js";
import getBotReply from "../services/chatbot.service.js"
import Blog from "../models/Blog.js"
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
        const location = req.query.location || "";
        const interests = req.query.interests && req.query.interests.trim() !== '' ? req.query.interests.split(',') : [];
        const name = req.query.name || "";
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let limit = req.query.limit ? parseInt(req.query.limit) : 1;
        const query = {};
        if (name) {
            query.username = { $regex: name, $options: "i" }
        }
        if (location) {
            query.location = { $regex: location, $options: "i" }
        }
        if (interests.length > 0) {
            query.interests = {
                $in: interests
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

export const sendRequest = async (req, res) => {
    try {
        const { receiverId } = req.body;
        if (!receiverId) {
            return res.send({
                status: 400,
                message: "Receiver ID is required to send a connection request.."
            })
        }
        if (receiverId === req.id) {
            return res.send({
                status: 400,
                message: "You cannot send request to yourself"
            });
        }

        const existing = await Connection.findOne({
            senderId: req.id,
            receiverId: receiverId
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Request already sent"
            });
        }
        const newRequest = new connection({
            senderId: req.id,
            receiverId: receiverId,
        })
        await newRequest.save();
        return res.send({
            status: 200,
            message: "Connection request sent successfully.."
        })

    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal Server Error.." + error.message
        })
    }
}

export const getRequests = async (req, res) => {
    try {
        const receivedRequests = await Connection.find({
            receiverId: req.id,
            status: "pending"
        }).populate("senderId", "username profilePic location interests");

        const sentRequests = await Connection.find({
            senderId: req.id
        }).populate("receiverId", "username profilePic location interests");

        return res.send({
            status: 200,
            message: "Connection requests fetched successfully..",
            receivedRequests,
            sentRequests
        })
    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal Server Error.." + error.message
        })
    }
}

export const respondRequest = async (req, res) => {
    try {
        const { status, connectionId } = req.body;
        const request = await Connection.findById(connectionId);
        if (!request) {
            return res.send({
                status: 404,
                message: "Connection request not found.."
            })
        }

        if (request.receiverId.toString() !== req.id) {
            return res.send({
                status: 403,
                message: "You are not authorized to respond to this request.."
            })
        }
        if (!["accepted", "rejected"].includes(status)) {
            return res.send({
                status: 400,
                message: "Invalid status value.."
            })
        }

        request.status = status;
        await request.save();
        return res.send({
            status: 200,
            message: `Connection request ${status} successfully..`
        })

    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal Server Error.." + error.message
        })
    }
}

export const getConnections = async (req, res) => {
    try {
        const connections = await Connection.find({
            status: "accepted",
            $or: [
                { senderId: req.id },
                { receiverId: req.id }
            ]
        }).populate("senderId", "username profilePic location interests").populate("receiverId", "username profilePic location interests");
        return res.send({
            status: 200,
            message: "Connections fetched successfully..",
            connections
        })
    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal Server Error.." + error.message
        })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;

        const connection = await Connection.findOne({
            status: "accepted",
            $or: [
                { senderId: req.id, receiverId },
                { senderId: receiverId, receiverId: req.id }
            ]
        });

        if (connection.isBot) {
            const botReply = await getBotReply(content);

            const botMessage = await Message({
                sender: receiverId, // bot
                receiver: senderId,
                content: botReply,
            });

            await botMessage.save();

            return { content, botMessage };
        }

        if (!connection) {
            return res.send({
                status: 403,
                message: "You can only send messages to your connections.."
            })
        }

        const newMessage = new Message({
            senderId: req.id,
            receiverId,
            content
        });
        await newMessage.save();
        return res.send({
            status: 200,
            message: "Message sent successfully..",
            messageData: newMessage
        })

    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal Server Error.." + error.message
        })
    }
}

export const getMessages = async (req, res) => {
    try {
        const { otherUserId } = req.query;
        const messages = await Message.find({
            $or: [
                { senderId: req.id, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: req.id }
            ]
        }).sort({ createdAt: 1 }).populate("senderId", "username profilePic").populate("receiverId", "username profilePic");
        return res.send({
            status: 200,
            message: "Messages fetched successfully..",
            messages
        })
    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal Server Error.." + error.message
        })
    }
}

export const chatbotController = async (req, res) => {
    try {
        const { message } = req.body;

        const reply = await getBotReply(message);

        return res.json({ reply });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const getAllBlogs = async (req, res) => {
    try {

        // 🔥 Query DB
        const blogs = await Blog.find()

        // 🔹 Total count
        const total = await Blog.countDocuments(filter);

        res.status(200).json({
            success: true,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
            data: blogs,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const createBlog = async (req, res) => {
    try {
        const {
            title,
            story,
            location,
            category,
            tripMood,
        } = req.body;

        let tags = req.body.tags;

        // 🔹 Convert tags if sent as string
        if (typeof tags === "string") {
            tags = tags.split(",");
        }

        if (!title || !story) {
            return res.status(400).json({
                success: false,
                message: "Title and Story are required",
            });
        }

        // 🔥 Upload images
        let uploadedImages = [];

        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "blogs",
                });

                uploadedImages.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        }

        const newBlog = await Blog.create({
            title,
            story,
            images: uploadedImages,
            coverImage: uploadedImages[0]?.url || "",
            location,
            category,
            tags,
            tripMood,
            author: req.user._id,
        });

        res.status(201).json({
            success: true,
            data: newBlog,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};