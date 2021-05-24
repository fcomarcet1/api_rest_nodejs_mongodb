'use strict';

const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user.model");
const jwtService = require("../services/jwt");

/**
 * @description Chek if user is authenticated
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
exports.verifyAuth = async (req, res, next) => {

    // Check if it arrives header authorization.
    if (!req.headers.authorization) {
        return res.status(403).send({
            status: "error",
            error: true,
            message: "Unauthorized. Cant received token from http headers forbidden access",
        });
    }
    try {
        // Get and Clear token -> remove quotes or double quotes
        let token = await req.headers.authorization.replace(/['"]+/g, "");

        // verifyToken(token) return token verified & decoded
        let decoded = await jwtService.verifyToken(token); // null

        if (decoded.error) {
            return res.status(403).send({
                status: "error",
                error: true,
                message: "Unauthorized. Cant verify token forbidden access",
            });
        }

        // find user in DB
        let identity = await jwtService.getIdentity(token);
        //console.log(identity);

        const user = await User.findOne({userId: identity.userId});

        if (!user) {
            return res.status(403).send({
                status: "error",
                error: true,
                message: "Invalid token. Unauthorized",
            });
        }
        next();
        /*return res.status(200).send({
            status: "success",
            error: false,
            message: "Info user logged NOTE: _id: id document, userId: userId",
            user: user,
        });*/

    } catch (error) {
        console.error("verify if user is authenticated", error);
        return res.status(500).send({
            status: "error",
            error: true,
            message: "Error middleware verifyAuth" + error,
        });
    }

};