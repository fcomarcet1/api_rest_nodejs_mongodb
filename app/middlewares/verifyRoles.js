'use strict';

const User = require("../models/user.model");
var jwtService = require("../services/jwt");
var Roles = require("../config/roles.config");


exports.checkRoleAdmin = async (req, res, next) => {
    console.log('verifyRoleAdmin middlw successfully')

    // Get token and decode token for identity
    let token = req.headers.authorization;
    let identity = await jwtService.getIdentity(token);
    //console.log(identity);

    if (identity.role !== Roles.admin) {
        console.log("no role admin")
        res.status(403).send({
            status: "error",
            message: "Forbidden. El cliente no posee los permisos necesarios para acceder(mddlw roleadmin)."
        });
    }

    next();
};


exports.checkRoleUser =  async (req, res, next) => {
    console.log('verifyRoleUser middlw successfully')

    // Get token and decode token for identity
    let token = req.headers.authorization;
    let identity = jwtService.getIdentity(token);

    console.log(identity.role);
    console.log(Roles.user);
    console.log(identity.role !== Roles.user);

    if (identity.role === Roles.user) {
        console.log(" role users next()")
        next();
    } else {
        res.status(403).send({
            status: "error",
            message: "Forbidden. El usuario no posee los permisos necesarios para acceder(mddlw roleuser)."
        });
    }
    /*//console.log(identity);
    if (identity.role !== configRoles.users){
        console.log("no role users")
        res.status(403).send({
            status: "error",
            message: "Forbidden. El cliente no posee los permisos necesarios para acceder(mddlw roleuser)."
        });
    }*/
    next();
};

