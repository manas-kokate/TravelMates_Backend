import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js"; // adjust path

const uploadFromBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "TravelMates_profilePics" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
};

export default uploadFromBuffer;