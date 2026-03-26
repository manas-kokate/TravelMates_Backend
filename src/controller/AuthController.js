import User from "../models/user.js";

export const registerUser = async(req,res)=>{
    try{
        const {username,email,password} = req.body;
        // existing user
        const existingUser = await User.findOne({email}) || await User.findOne({username});

        if(existingUser){
            return res.send({
                status:201,
                message:"User already exists...!"
            })
        }

        const newUser = new User({
            username,
            email,
            password
        })

        await newUser.save();

    }catch(error){
        return res.send({
            status:400,
            message:"Something went wrong. Server error!"
        })
    }
    }