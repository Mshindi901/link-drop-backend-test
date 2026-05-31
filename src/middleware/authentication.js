import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authenticator = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({
                success: false,
                message: 'No token sent'
            });
        };
        const token = authHeader.split(" ")[1];
        if(!token){
            return res.status(401).json({
                success: false,
                message: 'Invalid Token Format'
            });
        };
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error:  error.message
        })
    }
}