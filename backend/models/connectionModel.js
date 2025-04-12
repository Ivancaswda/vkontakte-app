import mongoose from 'mongoose'

const connectionSchema = new mongoose.Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required:true},
    receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required:true},
    status: {type:String, enum: ["pending", "connected", "rejected"], default: 'pending'},


}, {timestamps: true})

export const connectionModel = mongoose.models.connectionRequest || mongoose.model("connectionRequest", connectionSchema)