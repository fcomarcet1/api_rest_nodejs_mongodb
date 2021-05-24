'use strict';
require("dotenv").config();
const User = require("../models/user.model")
const jwt = require("jsonwebtoken");
const moment = require("moment");
const {v4: uuidv4} = require('uuid');

/**
 * @description Create authentication token.
 * @param user
 * @return {Promise<{authToken: *}>}
 */
exports.createAuthToken = async (user) => {

    try {
        const payload = {
            tokenId: uuidv4(), // token id
            sub: user._id, // idHash user document (60a8b94660323d35a8c72762)
            userId: user.userId, // id user (5ee0893c-cc00-479f-a964-91a33b8f3b7c)
            role: user.role,
            iss: "www.server-dns.com",
            aud: "www.my-domain.com",
            iat: moment().unix(), // created at
            exp: moment().add(24, 'h').unix(), // token expire in 24h
        };

        // Return token
        return await jwt.sign(payload, process.env.JWT_SECRET);

        /*return {
            authToken: authToken
        };*/

    } catch (error) {
        console.error("create Auth Token-error", error);
        return {
            status: "error",
            error: true,
            message: "create auth token error: " + error,
        };
    }
    /*
    * await jwt.sign({
        data: 'foobar'
        },
        'secret',
        { expiresIn: '1h' }
      );
* */
};


//TODO: ACABAR use in middleware verifyAuth
/**
 * @description Check if token is valid(expiration time, token_id).
 * @param token
 * @return {Promise<{error: boolean}>}
 */
exports.verifyToken = async (token) => {

    try {
        // verify,

        // comprobar que es valido con el secreto
        let decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        let userId = decodedToken.userId;


        // verificar token
        let checkToken = await User.findOne({
            accessToken: token,
            userId: userId,
        });

        if (!checkToken) {
            return {
                status: "error",
                error: true,
                message: "Token not valid:",
            };
        }

        // check if token has expired
        if (decodedToken.exp <= moment().unix()) {
            return {
                status: "error",
                error: true,
                message: "Token is expired",
            }
        }

        return {
            status: "success",
            error: false,
            message: "Token verified successful",
            authToken: decodedToken,
        }

    } catch (error) {
        console.error("verify Token error: ", error);
        return {
            status: "error",
            error: true,
            message: "verify Token error :" + error,
        };
    }
}


/**
 *
 * @param token
 * @return {Promise<{error: boolean, message, status: string}>}
 */
exports.getIdentity = async (token) => {

    try {
        // Check if token is valid and decode token with verify
        let authToken = await jwt.verify(token, process.env.JWT_SECRET);
        let documentId = authToken.sub;
        let userId = authToken.userId;

        // Get user info
        const user = await User.findOne({_id: documentId, userId: userId});
        if (!user) {
            console.log("Error al obtener user info getIdentityt()");
            return {
                status: "error",
                error: true,
                message: error,
            };
        }

        // Unset parameters
        user.active = undefined;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.emailToken = undefined;
        user.emailTokenExpires = undefined;
        user.referrer = undefined;
        user.password = undefined;
        user.__v = undefined;
        user.referralCode = undefined;

        // return user
        return user;

    } catch (error) {
        console.error("verify getIdentity Auth Token error: ", error);
        return {
            status: "error",
            error: true,
            message: error,
        };
    }

    /* try {

     } catch (error) {
         console.error("decode Auth Token error: ", error);
         return {
             status: "error",
             error: true,
             message: error,
         };
     }*/

};