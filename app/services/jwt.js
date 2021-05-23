'use strict';
require("dotenv").config();
const jwt = require("jsonwebtoken");
const moment = require("moment");
const {v4: uuidv4} = require('uuid');

/**
 * @description Create authentication token.
 * @param user
 * @return {Promise<{authToken: *, error: boolean}>}
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

        // Create token
        const authToken = await jwt.sign(payload, process.env.JWT_SECRET);

        // Return token
        return {
            error: false,
            authToken: authToken
        };

        // await jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' }, function(err, token) {
        //   console.log(token);
        // });

    } catch (error) {
        console.error("create Auth Token-error", error);
        return {
            status: "error",
            error: true,
            message: "create auth token error: " + error ,
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
 * @return {Promise<{error: boolean, message: string, status: string}>}
 */
exports.verifyToken = async (token) => {

    try {
        // comprobar que es valido con el secreto
        const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);

        // decode token
        const payload = await jwt.decode(token, process.env.JWT_SECRET);

        // comprobar fecha expiracion
        //if (payload.exp <= moment().unix()) {}

        // verificar id token
        // obtener id user, obtener accessToken y compararlo

    } catch (error) {
        console.error("create Auth Token-error", error);
        //throw new Error("create Auth Token-error " + error);
        return {
            status: "error",
            error: true,
            message: "create auth token error: " + error ,
            //error: error
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
        // Check if token is valid
        let verifyToken = await jwt.verify(token, process.env.JWT_SECRET);

        // decode token
        let decoded = await jwt.decode(token, process.env.JWT_SECRET);

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