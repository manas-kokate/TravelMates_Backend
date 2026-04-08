import { loginUser, refreshToken, registerUser } from "../controller/AuthController.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getCurrentLoggedInUser, respondRequest, searchUsers, discoverTravelers, updateUserProfile, uploadProfilePic, sendRequest, getRequests, getConnections, sendMessage, getMessages, chatbotController, createBlog, getAllBlogs } from "../controller/UserController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refreshToken', authMiddleware, refreshToken);
router.get('/currentUser', authMiddleware, getCurrentLoggedInUser);
router.put('/updateUserProfile', authMiddleware, updateUserProfile);
router.post('/uploadProfilePic', authMiddleware, upload.single("image"), uploadProfilePic);
router.get('/searchUser', authMiddleware, searchUsers);
router.get('/discoverTravelers', authMiddleware, discoverTravelers);

//Connection
router.post('/sendRequest', authMiddleware, sendRequest);
router.get('/getRequests', authMiddleware, getRequests)
router.post('/respondRequest', authMiddleware, respondRequest)
router.get('/getConnections', authMiddleware, getConnections)

//Messages
router.post('/sendMessage', authMiddleware, sendMessage)
router.get('/getMessages', authMiddleware, getMessages)
router.post('/getBotResponse', authMiddleware, chatbotController)

// Blogs
router.get("/getBlogs", getAllBlogs);
router.post("/createBlog", authMiddleware, upload.array("images", 5), createBlog);

export default router;