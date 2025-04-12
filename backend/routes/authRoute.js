import express from "express";
import {getCurrentUser, googleAuth, login, logout, signup} from "../controllers/authController.js";
import {protectRoute} from "../authMiddlewares/authMiddleware.js";

const authRouter = express.Router()

authRouter.post('/signup', signup)

authRouter.post('/login', login)

authRouter.post('/logout', logout)

authRouter.post('/google-auth', googleAuth)

authRouter.get('/get-user', protectRoute, getCurrentUser)

export default authRouter