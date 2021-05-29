'use strict';

const express = require('express');
const router = express.Router();

const CommentController = require('../controllers/comment.controller');
const cleanBody = require('../middlewares/cleanBody');

const AuthMiddleware = require('../middlewares/verifyAuth');
const RoleMiddleware = require("../middlewares/verifyRole");


//******************************* ROUTES *******************************
// Create new comment.
router.post(
    '/comment/topic/:topicId',
    [cleanBody, AuthMiddleware.verifyAuth],
    CommentController.create
);

module.exports = router;
