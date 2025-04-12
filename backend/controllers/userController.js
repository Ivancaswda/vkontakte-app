import userModel from "../models/userModel.js";
import {v2 as cloudinary} from 'cloudinary'

const getSuggestUsers = async (request,response) => {
    try {

        const user = request.user

        const currentUser = await userModel.findById(user._id).select('connections')
        // getting suggested users
        const suggestedUser = await userModel.find({
            _id: {
                $ne: user._id,
                $nin: currentUser.connections
            }
        }).select('fullName userName profilePic headline').sort({ createdAt: -1 })



        response.json({success:true, suggestedUser})
    } catch (error) {
        response.json({success:false, message: error.message})
    }
}

const getAllUsers = async (req, res) => {
    try {
        const user = req.user;
        console.log("Current user:", user);

        const currentUser = await userModel.findById(user._id).select('connections');
        console.log("Current user connections:", currentUser.connections);

        const allUsers = await userModel.find({
            _id: { $ne: user._id, $nin: currentUser.connections }
        }).select('fullName userName profilePic headline').sort({ createdAt: -1 });

        console.log("Suggested users:", allUsers);

        res.json({ success: true, allUsers });
    } catch (error) {
        console.error("Error:", error);
        res.json({ success: false, message: error.message });
    }
}

const getUsersProfile =  async (request, response) => {
    try {
        const userName = request.params.username
        console.log(userName)
        console.log('gasasggassg')
        const user = await userModel.findOne({userName: userName}).select("-password")

        if (!user) {
            return response.json({success:false, message: 'Пользователь не найден'})
        }

        response.json({success:true, user, message: 'Информация о пользователе найдена'})
    } catch (error) {
        response.json({success:false, message:error.message})
    }
}

const updateProfile = async (request, response) => {
    try {
        // all fields which we can change
        const userId = request.user._id
        const allowedFields = [
            "fullName",
            "userName",
            "about",
            "headline",
            "location",
            "profilePic",
            "bannerImg",
            "skills",
            "experiences",
            "education"];

        const updatedData = {}; // object of updatedData
        // check any field of user
        for (const field of allowedFields) {
            if (request.body[field]) {
                updatedData[field] = request.body[field] // replacing old data on new
            }
        }
        // check for the profile img and banner img

        // UPDATE PROFILE PUCTURE AND BANNER

        if (request.body.profilePicture) {
            const result = await cloudinary.uploader.upload(request.body.profilePicture)
            updatedData.profilePicture = result.secure_url // setting new image in db
        }

        if (request.body.bannerImg) {
            const result = await cloudinary.uploader.upload(request.body.bannerImg)
            updatedData.bannerImg = result.secure_url
        }



        const user = await userModel.findByIdAndUpdate(userId, {$set: updatedData},{new: true}).select('-password')
        // getting data of user except password


        response.json({success:true, user, message: 'Данные успешно обновлены!'})
    } catch (error) {
        response.json({success:false, message: 'Не удалось обновить профиль'})
    }
}

export {getSuggestUsers, getUsersProfile, updateProfile, getAllUsers}