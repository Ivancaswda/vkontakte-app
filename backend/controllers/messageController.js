import userModel from "../models/userModel.js";
import messageModel from "../models/messageModel.js";
import {v2 as cloudinary} from 'cloudinary'
import {getReceiverSocketId, io} from "../authMiddlewares/socket.js";
import notificationModel from "../models/notificationModel.js";

const getUsersForSidebar = async (request, response) => {

}

const getMessages = async (request, response) => {
    try {
        const {id:userToChatId} = request.params

        const myId = request.user._id


        const messages = await messageModel.find({$or: [

                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]}, )
            // creating notification





        console.log(messages)
        response.json({success:true, messages})
    } catch (error) {
        response.json({success:false, message:response.message})
    }

}

const sendMessage = async (request,response) => {
    try {
        const {text, image} = request.body
        const {id:receiverId} = request.params
        const senderId = request.user._id

        let imageUrl

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }
        console.log(imageUrl)
        // creating message

        const newMessage = new messageModel({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })



        await newMessage.save()






        const receiverSocketId = getReceiverSocketId(receiverId) // динамично отправляем
        // сообщение что получатель тут же его получит

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage)
        }


        //sending the notification that someone messaged u

        const receiver = await userModel.findById(receiverId)
        if (receiver._id.toString() !== senderId.toString()) {// проверяем чтобы отправляем получателю
            // create notif type of message

            const newNotification = await notificationModel({
                receiver: receiver._id,
                type: 'message',
                relatedUser: senderId
            })

            await newNotification.save()
        }
        response.json({success:true, newMessage})
    } catch (error) {
        response.json({success:false, message: error.message})
    }
}

const purgeChat = async (req, res) => {
    try {
        const userId = req.user._id
        const chatPartnerId = req.params.userId


        const response = await messageModel.deleteMany({
            $or: [
                {senderId: userId,receiverId: chatPartnerId },
                {senderId: chatPartnerId, receiverId: userId}
            ]
        })
        console.log(response.deletedCount)

        res.json({success:true, message: 'Чат успешно очищен!'})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}
export {getUsersForSidebar, getMessages, sendMessage, purgeChat}