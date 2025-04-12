import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {type:String, required: true},
    userName: {type: String, required: true},
    email: {type:String, required:true},
    password: {type:String, required:true},
    about: {type:String, default: 'Всем привет! я пользователь Вконтакте.'},
    profilePic: {type:String, default: ""},
    bannerImg: {type:String, default: ""},
    headline: {type:String, default: "Пользователь вконтакте"},
    location: {type:String, default: 'Земля'},
    skills: [String], /* expecting array of strings */
    experiences: [
        {
            title: String,
            company: String,
            startDate: Date,
            endDate: Date,
            description:String
        }
    ],
    education: [
        {
            school: String,
            fieldOfStudy: String,
            startYear: Number,
            endYear: Number
        }
    ],
    // getting users in array to which user has connection
    connections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]



}, {timestamps: true})

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel