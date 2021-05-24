'use strict';
const User = require("../models/user.model");
const jwt = require("../services/jwt");

/**
 * @description Get user info
 * @param req
 * @param res
 * @return {Promise<*>}
 */
exports.show = async (req, res) => {

    try{
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

        // Unset fields from user
        identity.role  = undefined;
        identity.active = undefined;
        identity.resetPasswordToken = undefined;
        identity.resetPasswordExpires = undefined;
        identity.emailTokenExpires = undefined;
        identity.emailToken = undefined;
        identity.referrer = undefined;
        identity.password = undefined;
        identity.accessToken = undefined;
        identity.referralCode = undefined;
        identity.__v = undefined;
        identity._id = undefined;

        // Return response
        return res.status(200).send({
            status: "success",
            error: false,
            message: "Info user logged NOTE: _id: id document, userId: userId",
            user: identity,
        });
    }catch (error) {
        console.error("show logged user:", error);
        return res.status(500).send({
            status: "error",
            error: true,
            message: "Error when try show logged user: " + error,
        });
    }


};


exports.getAll = async (req, res) => {};