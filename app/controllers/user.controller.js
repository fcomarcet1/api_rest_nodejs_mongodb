'use strict';
const User = require("../models/user.model");
const jwt = require("../services/jwt");

/**
 * @description Get user info
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.show = async (req, res) => {

    // Check request.
    if (!req.body) {
        return res.status(403).send({
            status: "error",
            message: "ERROR. API can´t received the request.",
        });
    }
    // get token from headers
    const token = req.headers.authorization;

    // Get data from user
    const identity = await jwt.getIdentity(token);

    // Return response
    return res.status(200).send({
        status: "success",
        error: false,
        message: "Info logged user",
        user: identity,
    });

};