import { Schema, model } from "mongoose";

const connectionSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }
}, { timestamps: true });

connectionSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });
export default model('Connection', connectionSchema);
