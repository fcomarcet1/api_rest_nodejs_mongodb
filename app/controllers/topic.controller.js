'use strict';

const validator = require("validator");

/**
 * @description Create new topic
 * @param req
 * @param res
 * @return {Promise<*>}
 */
exports.create = async (req, res) => {

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

    try{

        let params = req.body;
        //console.log(validator.isEmpty(params.title));

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

        /*let validateValidContent = validator.isAlpha(validator.blacklist(name, " ")); // ok-> true
        if (!validateValidContent) {
            return res.status(400).send({
                status: "error",
                error: "El campo contenido no es valido no puede contener numeros.",
            });
        }*/


        return res.status(201).send({
            status: "success",
            error: false,
            message: "Topic created successful",
        });
    }catch (error) {

    }
};
