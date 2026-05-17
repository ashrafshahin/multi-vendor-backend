const User = require('../models/userSchema');
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator');
const verificationToken = require('../models/verificationToken');
const nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid');


exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // Simple validation..-400-bad request-
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name or email or password are required...' })
        };

        // check if user already exist...409-Conflict-
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already Registered, Go to Log in...',
            })
        }
        const user = await new User({
            name: name,
            email: email,
            password: password,
            phone: phone || undefined,
            role: role || 'customer'

        })
        // save user in Database now... both way we can SAVE...
        await user.save()

        // Create verification Token
        const token = uuidv4()
        await new verificationToken({ userId: user._id, token }).save();

        // Send Email verification
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            }
        });
        // Verification URL Create here...
        const verificationUrl = `${process.env.APP_URL}/api/v1/auth/verify-email?token=${token}&email=${user.email}`

        const mailOption = {
            from: `"Shahin Multivendor Shop", <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Verify your Email - Shahin Multivendor eCommerce",
            html: `
                <h2>Welcome to our Platform</h2>
                <p>Hey, ${user.name} </p>
                <p>Thank you for registration, Please verify your email by clicking the link below...</p>
                <a href=${verificationUrl}>Verify Email</a>
                <p>This link will be expired in 24 hours</p>
                <p>Best regards, </br> Team Multivendor...</p>
            `
        };
        try {
            await transporter.sendMail(mailOption);
            console.log('Verification email sent...');
            
        } catch (error) {
            console.error('Error sending verification email: ', error)
        }

        // Create new profile of a User -201-Created-
        return res.status(201).json({
            success: true,
            message: 'registration successful, Please Login...',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                

            },
            token
        })

    } catch (error) {
        console.log(error); // --500-- internal server problem---
        return res.status(500).json({ success: false, message: 'Server error during registration...' })
    }
};

