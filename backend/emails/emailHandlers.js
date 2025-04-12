import {mailtrapClient, sender} from "../controllers/mailTrap.js";
import {
    createCommentNotificationEmailTemplate,
    createConnectionAcceptedEmailTemplate,
    createWelcomeEmailTemplate
} from "./emailTemplates.js";
import {response} from "express";

export const sendWelcomeEmail = async (email, fullName, profileUrl) => {
    try{
        const receiver = [{email}] // getting email of receiver

        const response = await mailtrapClient.send({
            from: sender,
            to: receiver,
            subject: "Добро пожаловать в вконтакте",
            html: createWelcomeEmailTemplate(fullName, profileUrl),
            category: 'welcome'
        })

        console.log('success sender',response)

    } catch (error) {
        console.log(error.message)
    }
}

export const sendCommentNotificationEmail = async (
        receiverEmail,
        receiverName,
        commenterName,
        postUrl,
        commentContent
    ) => {
    const receiver = [{email: receiverEmail}]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: receiver,
            subject: "Новый комментарий у тебя на посте",
            html: createCommentNotificationEmailTemplate(receiverEmail, commenterName, postUrl, commentContent),
            category: 'comment_notification',
        })
        console.log('comment notification email send successfully', response)
    } catch (error) {

    }
}
export const sendConnectionAcceptedEmail = async (senderEmail, senderName, receiverName, profileUrl) => {
    try {
        const receiver = [{email: senderEmail}]

        try {
            const response = await mailtrapClient.send({
                from: sender,
                to: receiver,
                subject: `${receiverName} принял твой запрос дружбы`,
                html: createConnectionAcceptedEmailTemplate(senderName, receiverName, profileUrl), // sending message on email with this template
                category: 'connection_accepted'

            })
        } catch (error) {

        }

    } catch (error) {

    }
}