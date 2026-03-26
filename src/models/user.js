import {Schema,model} from "mongoose";
import bcrypt from "bcrypt"
 const userSchema = new Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    profilePic:{
        type:String,
    },
    refreshToken:{
        type:String,
    }
 },{timestamps:true});


 userSchema.pre("save",async(next)=>{
    if(!this.isModified("password")){
        return next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
 })
 export default(model("User",userSchema));