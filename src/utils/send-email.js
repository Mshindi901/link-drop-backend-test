import {client} from '../inngest/client.js'
import nodemailer from 'nodemailer';
import dotenv from  'dotenv';
dotenv.config()

//sending the OTP
export const sendEmail = client.createFunction(
    {id: "send-otp-email", triggers: [{event: 'user/send.otp'}]},
    async({event}) => {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.GMAIL_PASSWORD
                }
            });

            const mailOptions = {
                from: process.env.EMAIL,
                to: event.data.email,
                subject: 'LinkDrop - OTP Verification',
                html: `
                    <h2>OTP Verification</h2>
                    <p>Your One-Time Password (OTP) for LinkDrop is:</p>
                    <h1 style="color: #0066cc; font-size: 32px; letter-spacing: 5px;">${event.data.otp}</h1>
                    <p>This OTP will expire in 5 minutes.</p>
                    <p>If you did not request this OTP, please ignore this email.</p>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully to:', event.data.email);
            return {success: true, sent: true}
        } catch (error) {
            console.error('Error sending email:', error);
            return {success: false, sent: false, error: error.message}
        }
    }
);

export default sendEmail;