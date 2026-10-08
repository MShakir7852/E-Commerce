// import express from "express";
const express=require("express")

// import getAdminDashboard from "../controllers/adminDashboardController.js";
const getAdminDashboard=require("../controllers/adminDashboardController.js")

const {
    isAuthenticated,
    isAdmin,
} =require("../midllware/isAuthenticated.js")

const router = express.Router();

router.get(
    "/",
    isAuthenticated,
    isAdmin,
    getAdminDashboard
);

module.exports= router;