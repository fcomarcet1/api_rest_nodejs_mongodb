'use strict';
require("dotenv").config();
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');

/**
 * @description Create authentication token.
 * @param user
 * @return {Promise<void>}
 */
exports.createAuthToken = async (user) => {

    try{
        const payload = {
            tokenId: uuidv4(), // token id
            sub: user._id, // idHash user document (60a8b94660323d35a8c72762)
            userId: user.userId, // id user (5ee0893c-cc00-479f-a964-91a33b8f3b7c)
            role: user.role,
            iss: "www.server-dns.com",
            aud: "www.my-domain.com",
            iat: moment().unix() , // created at
            exp:moment().add(24, 'h').unix(), // token expire in 24h
        };

        return await jwt.sign(payload, process.env.JWT_SECRET);

    }catch (error) {
        console.error("create Auth Token-error", error);
        // ?? lanzar error o return
        throw new Error("create Auth Token-error " + error);
        //return {status: error}
    }

    // Create token
    // await jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' }, function(err, token) {
    //   console.log(token);
    // });

    /*
    * await jwt.sign({
        data: 'foobar'
        },
        'secret',
        { expiresIn: '1h' }
      );
* */

};


exports.getIdentity = async () => {

};