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

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        // Check no Empty input...
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and Password required...' })
        };

        // Find user and select password
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid Credentials...' })
        };

        // Password match -bcrypt works- client vs DB password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid Credentials...' })
        }
        // Generate Token -jwt works-
        const accessToken = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );

        // Refresh Token -jwt works-
        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        );

        // Save Refresh Token to user...
        user.refreshTokens.push({
            token: refreshToken,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })

        // Save enerything...user e ja ase save...
        await user.save()

        // Cookie setup korbo
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production',
            samSite: 'strict',
            maxAge: 604800000, // 7 days
            path: '/',

        })

        res.status(200).json({
            success: true,
            message: 'Login successful...',
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified,

            }
        })

    } catch (error) {
        console.log('Login error:... ', error)
        return res.status(500).json({ success: false, message: 'Server error...x' })
    }
}





// Notes:
// expiresIn:           new Date(Date.now() + 7*24*60*60*1000) = 604800000 milliseconds
// aivabeo likha jai    new Date(Date.now() + 604800000)
// meaning ajke theke 7 days add hobe...

