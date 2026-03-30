import { loginUser, refreshToken, registerUser } from "../controller/AuthController.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getCurrentLoggedInUser, updateUserProfile, uploadProfilePic } from "../controller/UserController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refreshToken', authMiddleware, refreshToken);
router.get('/currentUser', authMiddleware, getCurrentLoggedInUser);
router.put('/updateUserProfile', authMiddleware, updateUserProfile);
router.post('/uploadProfilePic', authMiddleware, upload.single("image"), uploadProfilePic);

export default router;