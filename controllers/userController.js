const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailer = require("../utils/emailer");

// function to register users
const register = async (req, res) => {
    // get user data from request body
    const { name, username, email, password } = req.body;

    try {
        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: "Username is already taken, please set a different username." })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const login = async (req, res) => {
    // get user data from request body
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // check if password matches
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });

        // send response if everything is successful
        res.status(200).json({ message: `${user.name} login successful`, token });
    } catch (error) {
        res.status(500).json({ message: "Sorry something happened while logging in", error });
    }  
}

module.exports = { 
    register,
    login, 
};