import userModel from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {sendWelcomeEmail} from "../emails/emailHandlers.js";

const signup = async (request, response) => {
    try {
        const {fullName, userName, email, password} = request.body

       const existingEmail = await userModel.findOne({email})

       if (!fullName || !userName || !email || !password) {
           return response.json({success:false, message: 'Заполните все бланки!'})
       }



       if (existingEmail) {
           return response.json({success:false, message: "Электронная почта уже занята"})
       }

       if (password.length < 6) {
           return  response.json({success: false, message: 'Пароль должен быть более 6 символов'})
       }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)




       const user =  new userModel({
           email, fullName, userName, password:hashedPassword
       })



        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET,{expiresIn: '3d'}) // CREATING TOKEN

        response.cookie('jwt-vk', token,  {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 3 * 24 * 60 * 60 * 1000,
            secure: false
        })
        await user.save()



        const profileUrl = `${process.env.FRONTEND_URL}/profile` + user.userName


        try {
            await sendWelcomeEmail(user.email, user.fullName, profileUrl)
            console.log('send was commited')
        } catch (error) {
            console.log(error.message, 'sender of email messages does not succeed')
        }




       response.json({success:true, user, message: 'Вы успешно зарегистрировались'})
    } catch (error) {
        response.json({success:false, message: 'Не удалось зарегистрироваться (backend_error)'})
    }
}

const login = async (request, response) => {
    try {
        const {email, password} = request.body

        const user = await userModel.findOne({email})

        if (!email) {
            return response.json({success:false, message: 'Пользователь не найден!'})
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return  response.json({success:false, message: 'Неверный пароль'})
        }

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET,{expiresIn: '3d'}) // CREATING TOKEN

        response.cookie('jwt-vk', token,  {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 3 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production'
        })

        response.json({success:true, user, message: 'Вы успешно вошли в аккаунт!'})

    } catch (error) {

    }
}
const logout = (request, response) => {
    try {
        response.clearCookie("jwt-vk")
        response.json({ success:true ,message: 'logged out successfully'})
    } catch (error) {
        response.json({success:false})
    }
}

const getCurrentUser = (request, response) => {
    try {
        const user = request.user
        response.json({success:true, user})
    } catch (error) {
        console.log('Не удалось ', error)
        response.json({success:false, message: 'Server Error'})
    }
}

const googleAuth = async (request,response) => {
    try {
        const {userName, fullName, email, profilePic} = request.body

        let user = await userModel.findOne({email})

        if (!user) {
            user = new userModel({
                userName,
                fullName,
                email,
                profilePic,
                password: null // no password needed for goggle auth
            })


            await user.save()
        }
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET,{expiresIn: '3d'}) // CREATING TOKEN

        response.cookie('jwt-vk', token,  {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 3 * 24 * 60 * 60 * 1000,
            secure: false
        })
        response.json({success: true, user, message: 'Вы успешно авторизировались при помощи Google'})
    } catch (error) {
        console.log(error)
        response.json({success:false, message:error.message})
    }
}

export {signup, login, logout, getCurrentUser, googleAuth}