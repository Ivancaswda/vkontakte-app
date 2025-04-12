import {connectionModel} from "../models/connectionModel.js";
import userModel from "../models/userModel.js";
import notificationModel from "../models/notificationModel.js";
import {sendConnectionAcceptedEmail} from "../emails/emailHandlers.js";
import mongoose from "mongoose";

export const sendConnectionRequest = async (request, response) => {
    try {
        console.log(request.params)
        const {userId} = request.params
        const senderId = request.user._id
        const isConnected = request.user.connections.includes(userId)
        if (senderId.toString() === userId.toString()) {
            return response.json({success:false, message: 'Вы не можете отправлять запрос дружбы самому себе'})
        }

        if (isConnected) {
            return  response.json({success:false, message: 'Вы уже в друзьях с этим пользователем'})
        }

        const existingRequest = await connectionModel.findOne({
            sender: senderId,
            receiver: userId,
            status: 'pending'
        })

        if (existingRequest) {
            return  response.json({success:false, message: 'Вы уже отправляли запрос дружбы'})
        }

        const newRequest = new connectionModel({
            sender: senderId,
            receiver: userId
        })
        console.log(userId)

        await newRequest.save() // saving into db


        response.json({success:true,  message: 'Вы успешно отправили запрос дружбы'})
    } catch (error) {
        response.json({success:false, message: error.message})
        console.log(error.message)
    }
}

export const acceptConnectionRequest = async (req, response) => {
    try {


        const { requestId } = req.params;
        const userId = req.user._id; // Используем request.user

        if (!requestId) {
           return  response.json({success:false, message: 'requestId is not found'})
        }
        console.log(requestId)



        if (!mongoose.Types.ObjectId.isValid(requestId.toString())) {
            return response.status(400).json({ success: false, message: "Некорректный ID запроса" });
        }


        const request = await connectionModel.findById( new mongoose.Types.ObjectId(requestId) ).populate('sender', "fullName userName email")
            .populate("receiver", "fullName userName")

        // finding the offer via id in link tab

        if (!request) {
            return response.json({success:false, message: 'request is not found'})
        }



        if (request.receiver._id.toString() !== userId.toString()) {
            return response.status(403).json({ success: false, message: 'Запрос не для вас!' });
        }

        if (request.status !== 'pending') {
            return  response.json({success:true, message: 'Запрос уже сделан'})
        }

        request.status = 'connected'

        await request.save()

        // if im ur friend this u my friend function

        await userModel.findByIdAndUpdate(request.sender._id, {$addToSet: {connections: userId}})

        //this u my friend function
        await userModel.findByIdAndUpdate(userId, {$addToSet: {connections: request.sender._id}})


        // create notification on email

        const notification = new notificationModel({
            receiver: request.sender._id,
            type: 'connectionAccepted',
            relatedUser: userId // getting user sender / receiver

        })


        await notification.save() // creating and saving notification on email


        // todo sending email

        const senderEmail = request.sender.email
        const senderName = request.sender.fullName
        const receiverName = request.receiver.fullName
        const profileUrl = 'http://localhost:5174' + "/profile/" + request.receiver.userName
            //sending on email notif
        try {
            await sendConnectionAcceptedEmail(senderEmail, senderName, receiverName, profileUrl)

            response.json({success:true,message: 'Запрос дружбы был принят' })
        } catch (error) {
            response.json({success:false, message: error})
        }



    } catch (error) {
        response.json({success:false, message: error.message})
    }
}
export const rejectConnectionRequest = async (request, response) => {
    try {
        const {requestId} = request.params
        const userId = request.user._id
        const isPending = request.status === 'pending'
        const offer = await connectionModel.findById(requestId.toString())




        if (offer.receiver.toString() !== userId.toString()) {
            return response.json({success:false, message: 'Запрос отправлен не для вас!'})
        }

        if (offer.status !== 'pending') {
            return  response.json({success:true, message: 'Запрос уже сделан'})
        }

        offer.status = 'rejected'

        await offer.save()


        response.json({success:true, message: 'Запрос дружбы был отклонёен'})
    } catch (error) {
        response.json({success:false, message: error.message})
        console.log(error.message)
    }
}

export const getConnectionRequests = async (request, response) => { // получаем запросы на нас
    try {
        const userId = request.user._id

        const requests = await connectionModel.find({receiver: userId, status: 'pending'}).populate(
            "sender",
            "fullName userName profilePic headline connections" // getting data
        )
        response.json({success:true, requests})

    } catch (error) {
        response.json({success:false, message: error.message})
    }
}

export const getUserConnections = async (request, response) => {
    try {
        const userId = request.user._id

        // via using id we`re finding connections of user using populate


        const user = await userModel.findById(userId).populate(
            'connections', "fullName userName profilePic headline connections"
        ) // getting data
        const connections = user.connections
        response.json({success:true, connections})

    } catch (error) {
        response.json({success:false, message: error.message})
    }
}
// удалить  дружбy

export const removeConnection = async  (request, response) =>  {
    try {

        const receiverId = request.user._id
        const {senderId} = request.params
        console.log(receiverId, 'id получателя')
        console.log(senderId, 'id сендера')
        // function if im not ur friend thus u also not my friend
        if (!senderId || !mongoose.Types.ObjectId.isValid(senderId)) {
            return response.status(400).json({ success: false, message: 'Неверный ID пользователя' });
        }


        await userModel.findByIdAndUpdate(receiverId, { $pull: {connections: senderId}})

        await userModel.findByIdAndUpdate(senderId, { $pull: {connections: receiverId}})

        // removing on 100% connections between me and user-receiver
        await connectionModel.deleteMany({
            $or: [
                {sender: receiverId, receiver: senderId},
                {sender: senderId, receiver: receiverId}
            ]
        })

        response.json({success:true, message: 'Запрос дружбы успешно удалён'})
    } catch (error) {
        response.json({success:false, message: error.message})
    }
}

export const getConnectionStatus = async (request, response) => {
    try {

        console.log(request.params)
        const targetUserId = request.params.userId

        // if users already connection

        const currentUser = request.user
        console.log(currentUser)
        // checking if users already connected to each other
        if (currentUser.connections.includes(targetUserId)) {
            return response.json({status: 'connected'}) // статус обозначает дружбу
        }

        const pendingRequest = await connectionModel.findOne({
            $or: [
                {sender: currentUser._id, receiver: targetUserId},
                {sender: targetUserId, receiver: currentUser._id}
            ],
            status: 'pending'
        }) // checking for penidng request between both

        if (pendingRequest) { // если id совпадает то ставим статус pending

            if (pendingRequest.sender.toString() === currentUser._id.toString()) {
                return  response.json({status: 'pending'})
            } else { // just receiver yet
                return response.json({status: 'received', requestId: pendingRequest._id})
            }
        }

        // значит нету дружбы
        response.json({status: 'not_connected'})

    } catch (error) {
        response.json({success:false, message: error.message})
    }
}