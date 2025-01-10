const mongoose = require('mongoose');

const DBConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_HOST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
        });
        console.log('DB connected');
    } catch (error) {
        console.log('DB connection failed', error);
    }
}

module.exports = DBConnection;