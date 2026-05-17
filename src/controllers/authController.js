const User = require('../models/userSchema');
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

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

            }
        })

    } catch (error) {
        console.log(error); // --500-- internal server problem---
        return res.status(500).json({ success: false, message: 'Server error during registration...' })
    }
};

