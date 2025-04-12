import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
    receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    // какой повод уведомления (кто то лайкнул или тд)
    type: {type: String, required:true, enum: ["like", "comment", "connectionAccepted", 'message']},
    relatedUser: { // подобные пользователи
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    relatedPost: { // подобный пост
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    },
    read: {type: Boolean, default: false} // прочитано или нет

}, {timestamps: true})

const notificationModel = mongoose.models.notification || mongoose.model('notification', notificationSchema)

export default notificationModel
