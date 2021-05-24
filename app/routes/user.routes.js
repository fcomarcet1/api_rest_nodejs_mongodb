"use strict";

const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user.controller");
const cleanBody = require("../middlewares/cleanBody");
const AuthMiddleware = require("../middlewares/verifyAuth");

//********************** ROUTES ***********************************
router.get("/profile", [cleanBody, AuthMiddleware.verifyAuth], UserController.show);

module.exports = router;