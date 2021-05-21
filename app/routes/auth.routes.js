"use strict";

const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth.controller");
const cleanBody = require("../middlewares/cleanBody");


// ************************** API USER ROUTES *****************************************
router.post("/register",  AuthController.signUp);
//router.post("/register", verifyEmail.checkDuplicateEmail, AuthController.SignUp);
//router.get("/confirm/:confirmationCode", AuthController.verifyUser);
//router.post("/login", AuthController.signIn);


module.exports = router;