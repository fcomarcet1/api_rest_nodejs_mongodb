"use strict";

const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user.controller");
const cleanBody = require("../middlewares/cleanBody");

//********************** ROUTES ***********************************
router.get("/profile", cleanBody, UserController.show);


module.exports = router;