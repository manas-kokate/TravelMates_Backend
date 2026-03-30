import jwt from 'jsonwebtoken';
import env from 'dotenv';
env.config();

export const authMiddleware = (req, res, next) => {
    let token;
    try {

        if (!req.headers.authorization) {
            return res.send({
                status: 401,
                message: "Authorization token required"
            })
        }

        if (req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.id = decoded.userId;
                next();
            } catch (error) {
                return res.send({
                    status: 401,
                    message: "Invalid token. " + error.message
                })
            }
        }
        if (!req.headers.authorization.startsWith("Bearer")) {
            return res.send({
                status: 401,
                message: "Invalid token format. Check Bearer properly."
            })
        }

    } catch (error) {
        return res.send({
            status: 500,
            message: "Server error. " + error.message
        })
    }
}