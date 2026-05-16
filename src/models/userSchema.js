const mongoose = require('mongoose')
// const {Schema} = mongoose
const bcrypt = require('bcrypt')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required...'],
        trim: true,
        minLength: 3
    },
    email: {
        type: String,
        required: [true, 'Email is required...'],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
        type: String,
        unique: true,
        sparse: true,

    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Password is required...'],
        select: false,
        match: [
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain at least one letter and one number"
        ],
    },
    role: {
        type: String,
        enum: ['customer', 'admin', 'vendor'],
        default: 'customer',
    },
    isEmailVarified: {
        type: Boolean,
        default: false,
    },
    refreshToken: [{
        token: String,
        createdAt: {
            type: Date, default: Date.now,
        },
    }],
    createdAt: {
        type: Date, default: Date.now
    },

}, { timestamps: true });

// Password Hash before sending to database...
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next(); 
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt);
    //  return next()
});

// compare password...
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
};

module.exports = mongoose.model('User', userSchema)







// createdAt- kobe registration korse...
// this bolte userSchema bujaitese. 
// this deye arrow function kaj kore na...
// pre() mane save er age kichu akta kore save korba...
// next akta parametre neya hoise...