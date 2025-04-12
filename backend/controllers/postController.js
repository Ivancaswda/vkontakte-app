import postModel from "../models/postModel.js";
import {v2 as cloudinary} from 'cloudinary'
import NotificationModel from "../models/notificationModel.js";
import {sendCommentNotificationEmail} from "../emails/emailHandlers.js";
import notificationModel from "../models/notificationModel.js";


const getConnectedPosts =  async (request, response) => {
    try {

        console.log(request.user.connections)
        // showing posts of your friends and yourselves
        const posts = await postModel.find({author: {$in: [...request.user.connections, request.user._id]}})
            .populate("author",'fullName userName profilePic headline').populate(
                "comments.user", "fullName profilePic"
            ).sort({createdAt: -1}) // we can see latest post on the top
        // via id getting information

        // getting data of author user
        response.json({success:true, posts })
    } catch (error) {
        response.json({success:false, message: 'Не удалось получить пост'})
    }
}

const createPost =  async (request, response) => {
    try {
        const {content, image} = request.body
        const authorId = request.user._id

        console.log(content, 'content')
        console.log(image, 'image')
        let newPost

        if (image) {
            let imageResult = await cloudinary.uploader.upload(image)
            newPost = new postModel({
                author: authorId,
                content,
                image: imageResult.secure_url
            })
        } else {
            newPost = new postModel({
                author: authorId,
                content
            })
        }

        await newPost.save()

        response.json({success:true, newPost, message: 'Пост успешно создан'})
    } catch (error) {
        response.json({success:false, message: error.message})
    }
}
const removePost = async (request, response) => {
    try {
        const postId = request.params.id
        const userId = request.user._id

        const post = await postModel.findById(postId)

        if (!post) {
            return response.json({success:false, message: 'Post not found'})
        }

        if (post.author.toString() !== userId.toString()) {

            return response.json({success:false, message: 'Войдите в аккаунт создателя чтобы удалить пост'})

        }
        // delete the image from cloudinary
        if (post.image) {
            // deleting image from cloudinary db and mongo db
            await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0])
        }

        await postModel.findByIdAndDelete(postId)

        response.json({success:true, message: 'Пост успешно удалён'})
    } catch (error) {
        response.json({success:false, message: 'Пост был успешно удалён'})
    }
}

const getPostById = async (request, response ) => {
    try {
        const postId = request.params.id
        const post = await postModel.findById(postId).populate("author", "fullName userName profilePic headline").populate(
            "comments.user", "fullName userName headline profilePic"
        )

        response.json({success:true, post})
    } catch (error) {
        response.json({success:false, message: 'Не удалось получить пост'})
    }
}

const createComment = async (request, response) => {
    try {
        const postId = request.params.id
        const author = request.user._id
        const {content} = request.body

        const post = await postModel.findByIdAndUpdate(postId, {
        $push: {
            comments: {
                user: author, content
            }
        }},  {new: true}).populate("author", "fullName userName email headline profilePic")


        //create notification if the the comment owner isnot the post owner

        if (post.author._id.toString() !== author.toString()) {
            const newNotification = new NotificationModel({
                receiver: post.author,
                type: "comment",
                relatedUser: author,
                relatedPost: postId
            })

            await newNotification.save()

            // sending  email

            try {
                const postUrl = "http://localhost:5174" + "/post/" + postId
               await sendCommentNotificationEmail(post.author.email, post.author.fullName, request.user.fullName, postUrl, content)
            } catch (error) {
                response.json({success:false, message: 'Не удалось отправить уведомление'})
            }
        }

        response.json({success:true, post, message: 'Комментарий был оставлен'})

    } catch (error) {
        response.json({success:false, message: 'Не удалось получить комментарии'})
    }
}

const likePost = async (request, response) => {
    try {
        const postId = request.params.id
        const post = await postModel.findById(postId)
        const userId = request.user._id


        if (!post.likes.includes(userId)) { // user plans like the post in first time
            post.likes.push(userId) // adding into likes array userId
            // sending notification if user who likes not author

            if (post.author.toString() !== userId.toString()) {
                const newNotification = new NotificationModel({
                    receiver: post.author,
                    type: 'like',
                    relatedUser: userId,
                    relatedPost: postId
                })
                await newNotification.save()
            }
        } else { // user intends unlike the post
            post.likes = post.likes.filter(id => id.toString() !== userId.toString())
        }

        post.save()

        response.json({success:true, post, message: 'Вы успешно лайкнули пост'})
    } catch (error) {
        response.json({
            success: false, message: 'Не удалось лайкнуть пост'
        })
        console.log(error.message)
    }
}

export {createPost, getConnectedPosts, removePost, getPostById, createComment, likePost}