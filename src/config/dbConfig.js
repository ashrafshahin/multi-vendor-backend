const mongoose = require('mongoose');

const dbConfig = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
            console.log('Multi-Vendor Database Connected...');
            
    } catch (error) {
        console.error('Database connection error:', error.message);

        process.exit(1);
    }
}

module.exports = dbConfig

// async await use korle promice kora holo therefore, .then lagbe na
// res.status() cannot be used here because res doesn’t exist .. 
// process.exit(1) stops server if DB connection fails...