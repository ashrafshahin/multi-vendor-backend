const mongoose = require('mongoose');
const { Schema } = mongoose

const User = require('./userSchema');

const verificationTokenSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600 * 24,
    },

})

module.exports = mongoose.model('VerificationToken', verificationTokenSchema);

// Notes:
// type: mongoose.Schema.Types.ObjectId
// userId field - এর data type হবে MongoDB-এর ObjectId।
// অর্থাৎ এখানে সাধারণ string না, বরং অন্য document - এর _id store হবে।

// ref: 'User'
// এটা বলে যে এই ObjectId টি User model - এর সাথে linked।
// অর্থাৎ userId field - এ User collection - এর কোনো user - এর _id থাকবে।

// শুধু id না, পুরো user data পেয়ে যাবা।
// const post = await Post.find().populate('userId');