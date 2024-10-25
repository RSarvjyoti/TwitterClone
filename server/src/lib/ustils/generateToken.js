import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();
export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn : '15d'
    })

    res.cookie('jwt', token, {
        maxAge : 15*24*60*60*1000,
        httpOnly : true, // prevent XSS attacks cross-site scripting attacks
        smaeSite : 'strict', // CSRF attacks cross-site request forgery attacks
        secure : process.env.NODE_ENV !== 'developement',
    })

}
