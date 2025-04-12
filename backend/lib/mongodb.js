
import mongoose from 'mongoose'

const connectDb = async () => {

    mongoose.connection.on('connected', () => {
        console.log('База данных mongodb подключена!')
    })

    await mongoose.connect(`${process.env.MONGODB_URI}/vk`)
}

export {connectDb}