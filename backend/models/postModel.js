import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required:true},
    content: {type:String, required: true},
    image: {type:String},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}], // discovering which users liked
    comments: [{
         content: {type:String},
         user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
         createdAt: {type:Date, default: Date.now}
        }]
}, {timestamps: true})

const postModel = mongoose.models.post || mongoose.model('post', postSchema)
export default postModel