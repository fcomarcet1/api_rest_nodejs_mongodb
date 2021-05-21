'use strict';

require("dotenv").config();
const validator = require("validator");
const User = require("../models/user.model");
const utilsPassword = require("../helpers/utilsPassword");
const utilsEmail = require("../helpers/utilsEmail");
const config = require("../config/auth.config"); // config
const sendEmail = require("../services/mailer");

const {v4: uuid} = require("uuid");
const {customAlphabet: generate} = require("nanoid");

const CHARACTER_SET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const REFERRAL_CODE_LENGTH = 8;
const referralCode = generate(CHARACTER_SET, REFERRAL_CODE_LENGTH);

//const bcrypt = require("bcrypt-node");
//const jwt = require("../services/jwt"); // service jwt for create token
//const nodemailer = require("../config/nodemailer.config");

// TODO: Modificar responses

/**
 * @description Register
 * @param req
 * @param res
 * @return {Promise<*>}
 */
exports.signUp = async (req, res) => {

    // Check request.
    if (!req.body) {
        return res.status(403).send({
            status: "error",
            message: "ERROR. API can´t received the request.",
        });
    }

    // check if not send any required field
    if (
        req.body.name === undefined ||
        req.body.surname === undefined ||
        req.body.email === undefined ||
        req.body.password === undefined ||
        req.body.confirmPassword === undefined
    ) {
        return res.status(403).send({
            status: "error",
            message: "ERROR. Any field from register form not received.",
        });
    }

    try {
        let params = req.body;
        let name = params.name.trim();
        let surname = params.surname.trim();
        let email = params.email.trim();
        let password = params.password.trim();
        let confirmPassword = params.confirmPassword.trim();


        // Validate data from request (validator library)
        // Name
        let validateEmptyName = validator.isEmpty(name); // empty->true
        if (validateEmptyName) {
            return res.status(400).send({
                status: "error",
                error: "El campo nombre puede estar vacio.",
            });
        }
        let validateValidName = validator.isAlpha(validator.blacklist(name, " ")); // ok-> true
        if (!validateValidName) {
            return res.status(400).send({
                status: "error",
                error: "El campo nombre no es valido no puede contener numeros.",
            });
        }

        // Surname
        let validateEmptySurname = validator.isEmpty(surname); // empty->true
        if (validateEmptySurname) {
            return res.status(400).send({
                status: "error",
                error: "El campo apellidos puede estar vacio.",
            });
        }
        let validateValidSurname = validator.isAlpha(validator.blacklist(surname, " ")); // ok-> true
        if (!validateValidSurname) {
            return res.status(400).send({
                status: "error",
                error: "El campo apellidos no es valido no puede contener numeros.",
            });
        }

        // Email
        let validateEmptyEmail = validator.isEmpty(email);
        if (validateEmptyEmail) {
            return res.status(400).send({
                status: "error",
                error: "El campo email esta vacio",
            });
        }
        let validateValidEmail = validator.isEmail(email);
        if (!validateValidEmail) {
            return res.status(400).send({
                status: "error",
                error: "El campo email no es valido",
            });
        }

        // Password
        let validateEmptyPassword = validator.isEmpty(password);
        if (validateEmptyPassword) {
            return res.status(400).send({
                status: "error",
                error: "El campo password no puede estar vacio.",
            });
        }
        let validateValidPassword = validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
        }); // ok -> true

        if (!validateValidPassword) {
            return res.status(400).send({
                status: "error",
                error: "El campo password no es valido. Debe contener almenos: 8 caracteres, 1 minuscula, 1 mayuscula, 1 numero ",
            });
        }

        let validateEmptyPasswordConfirmation = validator.isEmpty(confirmPassword);
        if (validateEmptyPasswordConfirmation) {
            return res.status(400).send({
                status: "error",
                error: "El campo confirmar password no puede estar vacio.",
            });
        }

        // check 2 password = confirmPassword
        let equalsPasswords = validator.equals(password, confirmPassword);
        //console.log(equalsPasswords);
        if (!equalsPasswords) {
            return res.status(400).send({
                status: "error",
                error: "Las contraseñas no coinciden.",
            });
        }

        //Check if the email has been already registered.
        var user = await User.findOne({email: params.email,});

        if (user) {
            return res.json({
                status: "error",
                error: true,
                message: "Email is already in use",
            });
        }

        // Hash password
        const hash = await utilsPassword.hashPassword(params.password);

        //Generate unique id for the user.
        params.userId = uuid();

        //remove the confirmPassword field from the result as we dont need to save this in the db
        delete params.confirmPassword;
        params.password = hash;

        // Send email
        let code = Math.floor(100000 + Math.random() * 900000); //Generate random 6 digit code.
        let expiry = Date.now() + 60 * 1000 * 120; //120 mins in ms

        const sendCode = await sendEmail(params.email.toLowerCase(), code);

        if (sendCode.error) {
            return res.status(500).json({
                status: "error",
                error: true,
                message: "Couldn't send verification email.",
            });
        }

        params.emailToken = code;
        params.emailTokenExpires = new Date(expiry);

        //Check if referred and validate code.
        /*if (params.hasOwnProperty("referrer")) {
            let referrer = await User.findOne({
                referralCode: params.referrer,
            });
            if (!referrer) {
                return res.status(400).send({
                    error: true,
                    message: "Invalid referral code.",
                });
            }
        }*/
        params.referralCode = referralCode();

        const newUser = new User(params);
        await newUser.save();

        return res.status(200).json({
            success: true,
            message: "Registration Success. Check your email for confirmate your account",
            referralCode: params.referralCode,
        });

    } catch (error) {
        console.error("signup-error", error);
        return res.status(500).json({
            error: true,
            message: "Cannot Register",
        });
    }

};

/**
 * Validate the user account with the confirmation code
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.validateAccount = async (req, res) => {

    // Check request.
    if (!req.body) {
        return res.status(403).send({
            status: "error",
            message: "ERROR. API can´t received the request.",
        });
    }

    try {
        if (req.body.email === undefined || req.body.code === undefined) {
            return res.status(400).send({
                status: "error",
                message: "Please make a valid request any field not arrive",
            });
        }

        let params = req.body;
        let email = params.email;
        let confirmationCode = params.code;

        // Validation
        // Email
        let validateEmptyEmail = validator.isEmpty(email);
        if (validateEmptyEmail) {
            return res.status(400).send({
                status: "error",
                error: "El campo email esta vacio",
            });
        }
        let validateValidEmail = validator.isEmail(email);
        if (!validateValidEmail) {
            return res.status(400).send({
                status: "error",
                error: "El campo email no es valido",
            });
        }

        // Code
        let validateEmptyCode = validator.isEmpty(confirmationCode);
        if (validateEmptyCode) {
            return res.status(400).send({
                status: "error",
                error: "El campo codigo de confirmacion esta vacio",
            });
        }

        let validateValidCode = validator.isNumeric(confirmationCode);
        if (!validateValidCode) {
            return res.status(400).send({
                status: "error",
                error: "El código de verificacion no puede contener letras, solo puede contener números revisa el codigo en tu correo",
            });
        }

        // Check if email exist in DB
        let checkEmail = await utilsEmail.existsEmail(email); // return true/false
        if (!checkEmail){
            return res.status(400).send({
                status: "error",
                message: " El email introducido no pertenece a ningun usuario",
            });
        }
        console.log(checkEmail);
        /*const checkEmail = await User.findOne(
            {email: email.toLowerCase()},
            (err, email) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({
                        status: "error",
                        message: " error while check if mail exist in db",
                        error: err,
                    });
                }
                if (!email) {
                    return res.status(400).send({
                        status: "error",
                        message: " El email introducido no pertenece a ningun usuario",
                    });
                }
            }
        );*/

        // TODO: Check possible errors query
        // check if confirmationCode is valid
        const user = await User.findOne({
            email: email,
            emailToken: confirmationCode,
            emailTokenExpires: {$gt: Date.now()},
        });

        if (!user) {
            return res.status(400).json({
                status: "error",
                error: true,
                message: "Invalid code. Probably your authentication code is wrong or expired",
            });
        } else {
            if (user.active) {
                return res.status(400).send({
                    status: "success",
                    message: "Account already activated",
                });
            }

            user.emailToken = "";
            user.emailTokenExpires = null;
            user.active = true;

            // TODO: CHECK ERRORS SAVE()
            await user.save();

            return res.status(200).json({
                status: "success",
                message: "Account activated.",
            });
        }

    } catch (error) {
        console.error("activation-error", error);
        return res.status(500).json({
            status: "error",
            error: true,
            message: error.message,
        });
    }

};

/**
 * @description Refresh expired confirmation code for active account.
 * @param req
 * @param res
 * @return {Promise<*>}
 */
exports.refreshConfirmationCode = async (req, res) => {

    try{

        // Check request.
        if (!req.body) {
            return res.status(403).send({
                status: "error",
                message: "ERROR. API can´t received the request.",
            });
        }

        if (req.body.email === undefined){
            return res.status(400).send({
                status: "error",
                message: "ERROR. API can´t received the field email.",
            });
        }

        let params = req.body;
        let email = params.email;

        // Validate
        // Email
        let validateEmptyEmail = validator.isEmpty(email);
        if (validateEmptyEmail) {
            return res.status(400).send({
                status: "error",
                error: "El campo email esta vacio",
            });
        }
        let validateValidEmail = validator.isEmail(email);
        if (!validateValidEmail) {
            return res.status(400).send({
                status: "error",
                error: "El campo email no es valido",
            });
        }


    }
    catch (error) {
        console.error("refresh confirmationCode-error", error);
        return res.status(500).send({
            status:"error",
            message: "Cannot refresh confirmationCode",
        });
    }
};