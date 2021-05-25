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

/**
 * @description Get user list only ROLE_ADMIN.
 * @param req
 * @param res
 * @return {Promise<*>}
 */
exports.getAll = async (req, res) => {

    // Check request.
    if (!req.body) {
        return res.status(403).send({
            status: "error",
            error: true,
            message: "ERROR. API can´t received the request.",
        });
    }

    try{
        const users = await User.find();
        if (!users) {
            return res.status(404).send({
                status: "error",
                error: true,
                message: "No existen usuarios registrados actualmente.",
            });
        }

        // Unset fields from user
        users.forEach((value) => {
            value["password"] = undefined;
            value["__v"] = undefined;
            value["emailToken"] = undefined;
            value["emailTokenExpires"] = undefined;

        });

        // Return response
        return res.status(200).send({
            status: "success",
            error: false,
            users: users,
        });
    }catch (error) {
        console.error("show all users:", error);
        return res.status(500).send({
            status: "error",
            error: true,
            message: "Error when try show all users list: " + error,
        });
    }
};

/**
 * @description Get user data for fill update user account
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.edit = async (req, res) => {

    // Check request.
    if (!req.body) {
        return res.status(403).send({
            status: "error",
            error: true,
            message: "ERROR. API can´t received the request.",
        });
    }

    try {

        // get token from headers
        const authToken = req.headers.authorization;

        // Get data from user
        const identity = await jwt.getIdentity(authToken);

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
            message: "Edit user",
            user: identity,
        });

    }catch (error) {
        console.error("edit user:", error);
        return res.status(500).send({
            status: "error",
            error: true,
            message: "Error when try show data user for edit: " + error,
        });
    }
};

/**
 * @description Update and save new user data
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.update = async (req, res) => {

    // Check request.
    if (!req.body) {
        return res.status(403).send({
            status: "error",
            error: true,
            message: "ERROR. API can´t received the request.",
        });
    }

    try {
        return res.status(200).send({
            status: "success",
            error: false,
            message: "update method",
        });
    }catch (error) {
        console.error("edit user:", error);
        return res.status(500).send({
            status: "error",
            error: true,
            message: "Error when try update data user : " + error,
        });
    }
};