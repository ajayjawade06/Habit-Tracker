import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create nodemailer transporter with secure settings
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify transporter connection
transporter.verify(function(error, success) {
    if (error) {
        console.log("SMTP Connection Error:", error);
    } else {
        console.log("SMTP Server is ready to take our messages");
    }
});

// Generate 6-digit OTP
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send Registration Verification Email
export const sendVerificationEmail = async (email, otp, name) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Habit Tracker - Verify Your Email',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
                    <h1 style="color: #4F46E5; text-align: center; margin-bottom: 30px;">Welcome to Habit Tracker! 🎉</h1>
                    
                    <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-bottom: 20px;">Hi ${name}!</h2>
                        
                        <p style="color: #666; line-height: 1.6;">We're excited to have you join our community! To get started, please verify your email address by entering the following verification code:</p>
                        
                        <div style="background-color: #4F46E5; color: white; font-size: 24px; font-weight: bold; text-align: center; padding: 15px; margin: 20px 0; border-radius: 6px;">
                            ${otp}
                        </div>
                        
                        <p style="color: #666; line-height: 1.6;">This code will expire in 10 minutes for security purposes.</p>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                            <p style="color: #888; font-size: 14px;">If you didn't create an account with Habit Tracker, you can safely ignore this email.</p>
                        </div>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending verification email:', error);
        return false;
    }
};

// Send OTP email for password reset
export const sendOTPEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request - Habit Tracker',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
                    <h1 style="color: #4F46E5; text-align: center; margin-bottom: 30px;">Password Reset Request</h1>
                    
                    <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <p style="color: #666; line-height: 1.6;">We received a request to reset your password. Here's your one-time password (OTP):</p>
                        
                        <div style="background-color: #4F46E5; color: white; font-size: 24px; font-weight: bold; text-align: center; padding: 15px; margin: 20px 0; border-radius: 6px;">
                            ${otp}
                        </div>
                        
                        <p style="color: #666; line-height: 1.6;">This code will expire in 10 minutes.</p>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                            <p style="color: #888; font-size: 14px;">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                        </div>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return false;
    }
};

// Send habit reminder email
export const sendHabitReminderEmail = async (email, habitTitle, timeOfDay, userName) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '🎯 Time to Complete Your Habit! - Habit Tracker',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
                    <h1 style="color: #4F46E5; text-align: center; margin-bottom: 30px;">Habit Reminder</h1>
                    
                    <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-bottom: 20px;">Hi ${userName}!</h2>
                        
                        <p style="color: #666; line-height: 1.6;">It's time for your ${timeOfDay} habit:</p>
                        
                        <div style="background-color: #4F46E5; color: white; font-size: 20px; text-align: center; padding: 15px; margin: 20px 0; border-radius: 6px;">
                            ${habitTitle}
                        </div>
                        
                        <p style="color: #666; line-height: 1.6;">Your habit is ready to be completed! Head over to your dashboard to mark it as done and keep your streak going! 💪</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="/dashboard" style="background-color: #4F46E5; color: white; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: bold;">Go to Dashboard</a>
                        </div>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                            <p style="color: #888; font-size: 14px;">Keep up the great work! Every completion brings you closer to your goals.</p>
                        </div>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending habit reminder email:', error);
        return false;
    }
};

export default { generateOTP, sendOTPEmail, sendVerificationEmail, sendHabitReminderEmail };