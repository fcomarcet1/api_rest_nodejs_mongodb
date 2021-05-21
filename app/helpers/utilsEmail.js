'use strict';

const bcrypt = require("bcryptjs");
const User = require("../models/user.model")

/**
 *
 * @param email
 *
 */
exports.existsEmail = async (email) => {

    try {
        //let existsEmail = false;
        const issetEmail = await User.findOne({email: email.toLowerCase()});
        if (issetEmail) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.log(error);
        // ?throw error or response error????¿
        throw new Error("check exists email failed " + error);
    }
};