const jwt=require("jsonwebtoken")
const User=require("../models/userModel.js")

const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access toekn is missing or invalid" });
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
        req.user=user
        req.id = user._id;
        next()
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const isAdmin=async(req,res,next)=>{
    if(req.user&&req.user.role==='admin'){
        next()
    }
    else{
        res.status(403).json({message:'request denied. only admin allowed'})
    }
}
module.exports={isAuthenticated,isAdmin}