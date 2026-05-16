const User = require('../models/userSchema');

const registrationController = async (req, res) => {
    const { name, email, password, } = req.body;
    try {
        const createProfile = await new User({
            name:name,
            email:email, 
            password: password,
            
        }).save()
        
        return res.status(201).json({success: true, message: 'registration successful...' })
        
    } catch (error) {
        console.log(error);
        
        return res.send('server error...x')
    }
}

module.exports = {registrationController, }