import express from 'express'
import {protectRoute} from "../authMiddlewares/authMiddleware.js";
import {
    acceptConnectionRequest, getConnectionRequests, getConnectionStatus, getUserConnections,
    rejectConnectionRequest, removeConnection,
    sendConnectionRequest
} from "../controllers/connectionController.js";

const connectionRouter = express.Router()

        // sending offer of friendship
connectionRouter.post("/request/:userId", protectRoute, sendConnectionRequest)
connectionRouter.put("/accept/:requestId", protectRoute, acceptConnectionRequest)
connectionRouter.put("/reject/:requestId", protectRoute, rejectConnectionRequest)
connectionRouter.get("/requests", protectRoute, getConnectionRequests)
connectionRouter.get("/", protectRoute, getUserConnections) // Предложения дружбы у пользователя
connectionRouter.delete("/removeC/:senderId", protectRoute, removeConnection)
connectionRouter.get('/status/:userId', protectRoute, getConnectionStatus)
export default connectionRouter