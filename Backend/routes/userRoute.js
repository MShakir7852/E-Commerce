const express = require("express");
const router = express.Router();
const { Registration, verify, reVerify, login, logout, forgetPassword,changePassword,verifyOtp, alluser, getUserbyId } = require("../controllers/userController.js");
const {isAuthenticated,isAdmin} = require("../midllware/isAuthenticated.js");

router.post("/register", Registration);
router.post("/verify/:token", verify);
router.post("/reverify", reVerify);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout)
router.post("/forget-password", forgetPassword);
router.post("/otp-verify/:email", verifyOtp);
router.post("/change-password/:email",changePassword)
router.get("/all-user",isAuthenticated,isAdmin,alluser)
router.get('/get-user/:userId',getUserbyId)

module.exports = router;