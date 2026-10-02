const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyEmail = require("../utills/verifyEmail.js");
const Session = require("../models/userSession.js");
const optSend = require("../utills/otpSend.js");

const Registration = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashpass = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashpass
        });
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "10m" });
        verifyEmail(token, email);
        newUser.token = token;
        await newUser.save();
        res.status(201).json({ success: true, message: "User created successfully", token, user: newUser });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const verify = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        }
        catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Token expired" });
            }
            return res.status(401).json({ message: "Invalid token" });
        }
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.isVerified = true;
        user.token = null;
        await user.save();
        res.status(200).json({ message: "Email verified successfully" });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const reVerify = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: "Email is already verified" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });
        verifyEmail(token, email);
        user.token = token;
        await user.save();
        res.status(200).json({ message: "Again Verification email sent successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }

}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const existuser = await User.findOne({ email });
        if (!existuser) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, existuser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (existuser.isVerified === false) {
            return res.status(400).json({ message: "please verify your email before trying to login" });
        }

        const accessToken = jwt.sign({ id: existuser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const refreshToken = jwt.sign({ id: existuser._id }, process.env.JWT_SECRET, { expiresIn: "10d" });


        const existingSession = await Session.findOne({ userId: existuser._id });
        if (existingSession) {
            await Session.deleteOne({ userId: existuser._id });
        }
        existuser.isLoggedIn = true;
        await existuser.save();

        await Session.create({ userId: existuser._id });
        res.status(200).json({ message: `Welcome back, ${existuser.firstName}!`, accessToken, refreshToken, user: existuser });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });

    }
}

const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000);

        user.otp = otp;
        user.expiredOtp = Date.now() + 1 * 60 * 1000; 
        await user.save();
        
        await optSend(otp, email);
        res.status(200).json({ message: "OTP sent to email" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body
        const email = req.params.email
        if (!otp) {
            res.status(400).json({ message: "otp is required" })
        }
        const user = await User.findOne({ email })
        if (!user) {
            res.status(400).json({ message: "user not found" })
        }
        if (!user.otp || !user.expiredOtp) {
            res.status(400).json({ message: "otp is not generated or already verified" })
        }
        if (user.expiredOtp < new Date()) {
            res.status(400).json({ message: "opt has expired please request new one" })
        }
        if (otp !== user.otp) {
            res.status(400).json({ message: "otp is invalid" })
        }
        user.otp = null
        user.expiredOtp = null
        await user.save()
        res.status(200).json({ message: "otp verified successfully" })

    } catch (error) {
        res.status(500).json({ message: "otp is not valid " + error.message })
    }
}

const logout = async (req, res) => {
    try {
        const userId = req.id;
        await Session.deleteMany({ userId: userId });
        await User.findByIdAndUpdate(userId, { isLoggedIn: false })
        res.status(200).json({ message: "user Logged out successful" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


const changePassword = async (req, res) => {
    try {
        const { newpassword, confirmpassword } = req.body;
        const { email } = req.params;

        // Check email
        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }


        // Check passwords
        if (!newpassword || !confirmpassword) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check password match
        if (newpassword !== confirmpassword) {
            return res.status(400).json({
                message: "New password and confirm password don't match"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(newpassword, 10);

        // Update password
        user.password = hashPassword;

        await user.save();

        return res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {
        console.log("Change Password Error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};



const alluser = async (_, res) => {
    try {
        const user = await User.find();
        res.status(200).json({ message: "successfully user fetch", user })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const getUserbyId = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('-password -otp -expiredOtp -token')
        if (!user) {
            req.status(400).json({ message: "user not found" })
        }
        res.status(200).json({ message: 'user found', user })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports = { Registration, verify, reVerify, login, forgetPassword, logout, changePassword, verifyOtp, alluser, getUserbyId };