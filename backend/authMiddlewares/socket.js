import express from 'express'
import {Server} from 'socket.io'
import http from 'http'

export const app = express()

export const server = http.createServer(app)

export const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5174'], // backend server,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
})

export function getReceiverSocketId(userId) {
    return userSocketMap[userId]
}

const userSocketMap = {}


io.on('connection', (socket) => {
    console.log('Пользователь подключен', socket.id)

    const userId = socket.handshake.query.userId
    if (userId) {
        userSocketMap[userId] = socket.id
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap))


    // Отправка уведомлений пользователю
        io.to(userSocketMap[userId]).emit('new-notification');
        io.to(userSocketMap[userId]).emit('new-connection');



    socket.on('disconnect', () => {
        console.log('пользователь отключён', socket.id)
        delete userSocketMap[userId]

        io.emit('getOnlineUser', Object.keys(userSocketMap))
    })
})