import express from 'express'
import {
    createComment,
    createPost,
    getConnectedPosts,
    getPostById,
    likePost,
    removePost
} from "../controllers/postController.js";
import {protectRoute} from "../authMiddlewares/authMiddleware.js";

const postRouter = express.Router()

postRouter.get('/get-connected-post', protectRoute, getConnectedPosts)

postRouter.post('/create', protectRoute,  createPost)

postRouter.delete('/remove/:id', protectRoute, removePost)

postRouter.get('/:id', protectRoute, getPostById)

postRouter.post("/:id/comments",protectRoute, createComment)

postRouter.post("/:id/like", protectRoute,likePost)

export default postRouter