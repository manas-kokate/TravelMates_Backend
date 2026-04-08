import { Schema, model } from "mongoose";

const messageSchema = new Schema({
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
    content: {
        type: String,
        required: true
    },
}, { timestamps: true });

messageSchema.index({ sender: 1, receiver: 1 });

export default model("Message", messageSchema);