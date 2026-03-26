import jwt from "jsonwebtoken";

// Access token generation
const generateAccessToken = async (userId)=>{
    return jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"15m"});
};

// Refresh token generation
const generateRefreshToken = async(userId)=>{
    return jwt.sign({userId},process.env.JWT_REFRESH_SECRET,{expiresIn:"7d"})
}

export {generateAccessToken,generateRefreshToken}