"use strict";

const express = require("express");
const router = express.Router();

const TopicController = require("../controllers/topic.controller");
const cleanBody = require("../middlewares/cleanBody");
const AuthMiddleware = require("../middlewares/verifyAuth");

//******************************* ROUTES *******************************
router.post("/create", [cleanBody, AuthMiddleware.verifyAuth], TopicController.create );



module.exports = router;

