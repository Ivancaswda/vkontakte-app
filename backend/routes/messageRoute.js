import express from "express";
import {getMessages, getUsersForSidebar, purgeChat, sendMessage} from "../controllers/messageController.js";
import {protectRoute} from "../authMiddlewares/authMiddleware.js";
const messageRouter = express.Router()

messageRouter.get('/users-for-sidebar', protectRoute, getUsersForSidebar)

messageRouter.get('/get/:id', protectRoute, getMessages)

messageRouter.post('/send/:id', protectRoute, sendMessage)

messageRouter.delete('/purge/:userId', protectRoute, purgeChat)

export default messageRouter