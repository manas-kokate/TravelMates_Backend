import { Schema, model } from "mongoose";
import bcrypt from "bcrypt"
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    location: {
        type: String,
        required: true
    },
    interests: {
        type: [String],
        trim: true
    },
    isBot: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) {
        return next;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next;
})
export default (model("User", userSchema));