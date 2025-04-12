import express from 'express'
import {protectRoute} from "../authMiddlewares/authMiddleware.js";
import {
    getUserNotifications,
    markNotificationAsRead,
    removeNotification
} from "../controllers/notificationController.js";


const notificationRouter = express.Router()

notificationRouter.get('/', protectRoute, getUserNotifications)

notificationRouter.put('/:id/read', protectRoute, markNotificationAsRead)

notificationRouter.delete("/:id", protectRoute, removeNotification)

export default notificationRouter