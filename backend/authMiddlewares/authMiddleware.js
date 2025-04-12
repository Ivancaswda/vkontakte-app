import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';

const protectRoute = async (request, response, next) => {
    try {
        const token = request.cookies['jwt-vk']

        if (!token) {
            return response.json({success: false, message: 'Unauthorized - No Token Provided'})
        }
        const decoded  = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return  response.json({success:false, message: 'Unauthorized - Invalid Token'})
        }

        const user = await userModel.findById(decoded.userId)

        if (!user) {
            return  response.json({success: false, message: 'User is not found'})
        }

        request.user = user

        next()


    } catch (error) {
        console.log(error)
        response.json({success:false, message: error.message})
    }
}
export {protectRoute}