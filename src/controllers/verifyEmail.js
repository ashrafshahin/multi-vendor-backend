const User = require("../models/userSchema");
const verificationToken = require("../models/verificationToken");

exports.verifyEmail = async (req, res) => {
    const { token, email } = req.query
    try {
        const verificationToken = await verificationToken.findOne({ token });
        if (!verificationToken) {
            return res.status(400).json({ success: false, message: 'Invalid or Expired Token...' })
        };
        const user = await User.findById(verificationToken.userId)
        if (!user || user.email !== email) {
            return res.status(400).json({ success: false, message: 'Invalid request...' })
        };

        // Email verification true hobe sob thik thakle and save
        user.isEmailVerified = true,
            await user.save()
        
        // verification token delete after used...
        await verificationToken.deleteOne({ _id: verificationToken._id });

        // Frontend Redirect URL
        res.redirect(`${process.env.FRONTEND_URL}/verify-success?email=${email}`);

    } catch (error) {
        console.log('Email verification error: ',error);
        return res.status(500).json({ success: false, message: 'server error...' })
    }
};






// notes:
// if(!user || user.email !== email )
// frontend theke je email astese oita email similar na hoi, error-400 - debe...

