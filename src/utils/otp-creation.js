import crypto from 'crypto';

export default function generateOTP(){
    try {
        return crypto.randomInt(100000, 999999).toString();
    } catch (error) {
        console.error(error);
        return null;
    }
};