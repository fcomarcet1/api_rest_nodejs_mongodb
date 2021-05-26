'use strict';
const Topic = require("../models/topic.model");
const jwtService = require("../services/jwt");
const validator = require("validator");
const {v4: uuidv4} = require('uuid');

/**
 * @description Create new topic
 * @param req
 * @param res
 * @return {Promise<*>}
 */
exports.create = async (req, res) => {

    // Check request
    if (!req.body) {
        return res.status(403).send({
            status: "error",
            error: true,
            message: "ERROR. API can´t received the request.",
        });
    }

    // check if not send any required field
    if (req.body.title === undefined || req.body.content === undefined ||
        req.body.code === undefined || req.body.language === undefined
    ) {
        return res.status(403).send({
            status: "error",
            message: "ERROR. Any field from create topic form not received.",
        });
    }

    try {

        let params = req.body;

        // Trim data
        params.title.trim();
        params.content.trim();
        params.code.trim();
        params.language.trim();


        // validate fields
        // Title
        let validateEmptyTitle = validator.isEmpty(params.title); // empty->true
        if (validateEmptyTitle) {
            return res.status(400).send({
                status: "error",
                error: true,
                message: "El campo titulo puede estar vacio.",
            });
        }

        let validateValidTitle = validator.isAlphanumeric(validator.blacklist(params.title, " */@{}<>.")); // ok-> true
        if (!validateValidTitle) {
            return res.status(400).send({
                status: "error",
                error: true,
                message: "El campo titulo no es valido no no introduzcas caracteres especiales.",
            });
        }

        // Content
        let validateEmptyContent = validator.isEmpty(params.content); // empty->true
        if (validateEmptyContent) {
            return res.status(400).send({
                status: "error",
                error: true,
                message: "El campo contenido puede estar vacio.",
            });
        }

        // Language
        let validateEmptyLanguage = validator.isEmpty(params.language); // empty->true
        if (validateEmptyLanguage) {
            return res.status(400).send({
                status: "error",
                error: true,
                message: "El campo contenido puede estar vacio.",
            });
        }

        // Code Optional
        /*let validateValidCode = validator.isAlpha(validator.blacklist(params.code, " ")); // ok-> true
        if (!validateValidCode) {
            return res.status(400).send({
                status: "error",
                error: "El campo contenido no es valido no puede contener numeros.",
            });
        }*/

        // Crear objeto a guardar
        let topic = new Topic();

        // Get user id
        let token = req.headers.authorization;
        
        let identity = await jwtService.getIdentity(token);
        if (identity.error || Object.keys(identity).length === 0 ) {
            return res.status(404).send({
                status: "error",
                error: true,
                message: "Error cant create new topic",
            });
        }

        // Asignar valores
        topic.title = params.title;
        topic.content = params.content;
        topic.code = params.code;
        topic.lang = params.language;
        topic.user = identity._id;

        // Guardar el topic
        let topicSaved = await topic.save();

        if (!topicSaved || Object.keys(topicSaved).length === 0){
            return res.status(404).send({
                status: "error",
                error: true,
                message: "Error cant create new topic",
            });
        }


        // Return response.
        return res.status(201).send({
            status: "success",
            error: false,
            message: "Topic created successful",
            topicSaved: topicSaved,

        });
    } catch (error) {
        console.error("create topic:", error);
        return res.status(500).send({
            status: "error",
            error: true,
            message: "Error when try create new topic: " + error,
        });
    }
};
