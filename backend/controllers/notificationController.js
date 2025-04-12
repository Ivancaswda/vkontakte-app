import notificationModel from "../models/notificationModel.js";

export const getUserNotifications = async (request, response) => {
    try {
        const  userId = request.user._id

        // getting information of user from which we got notification

        const notifications = await                                   // latest notification on the top
            notificationModel.find({receiver: userId}).sort({createdAt: -1}).populate("relatedUser",
                "fullName userName profilePic").populate("relatedPost", "content image")


        response.json({success:true, notifications})

    } catch (error) {
        response.json({success:false, message: error.message})
    }
}

export const markNotificationAsRead = async (request, response) => {
    const notifId= request.params.id
    try {                                                                                 // if receiver is us thus
        const notification = await notificationModel.findByIdAndUpdate({_id: notifId, receiver: request.user._id},
            // marking it as read
            {read:true}, {new:true})


        response.json({success:true, notification, message: 'Вы пометили уведомление как прочитанное'})
    } catch (error) {
        response.json({success:false, message:error.message})
    }
}

export const removeNotification = async (request, response) => {
    try {
        const notifId = request.params.id
        await notificationModel.findByIdAndDelete({_id: notifId, receiver: request.user._id})
        response.json({success:true, message: 'Уведомление удалено успешно!'})
    } catch (error) {
        response.json({success:false, message: error.message})
    }
}

// todo create separate function for getting unreadNotification about message

/* const getUnreadNotifications = async (request, response) => {
    try {
        const userId = request.user._id

        const unreadNotifications = await notificationModel.countDocuments({
            receiver:userId,
            read:false // confirming the aforementioned title of the function
        })

        response.json({success:false, unreadNotifications})
    } catch (error) {
        response.json({success:false, message:error.message})
    }
} */