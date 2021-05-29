'use strict';

const Comment = require('../models/topic.model');
const Topic = require('../models/topic.model');
const mongoose = require('mongoose');

const jwtService = require('../services/jwt');
const validator = require('validator');
const {v4: uuidv4} = require('uuid');
const moment = require('moment');


/**
 * @description Create new comment
 * @param req
 * @param res
 * @return {Promise<*>}
 */
exports.create = async (req, res) => {

    if (!req.params.topicId || !req.body) {
        return res.status(400).send({
            status: 'error',
            error: true,
            message: "API Cannot received parameters",
        });
    }

    try {
        // Get URL param && body params
        const topicId = req.params.topicId.toString();
        let params = req.body;
        let content = params.content.trim();

        // Find if id is valid
        let validTopicId = mongoose.Types.ObjectId.isValid(req.params.topicId);
        if (!validTopicId) {
            return res.status(404).send({
                status: 'error',
                error: true,
                message: 'This topic not exist: ',
            });
        }

        // Check if exist topic
        let topic = await Topic.findById({_id: topicId});
        if (!topic || Object.keys(topic).length === 0 || topic.length === 0) {
            return res.status(404).send({
                status: 'error',
                error: true,
                message: 'This topic not exist: ',
            });
        }

        // check if not send any required field
        if (req.body.content === undefined) {
            return res.status(403).send({
                status: 'error',
                error: true,
                message: 'ERROR.content field is required.',
            });
        }

        // Validate
        let validateEmptyContent = validator.isEmpty(content); // empty->true
        if (validateEmptyContent) {
            return res.status(400).send({
                status: 'error',
                error: true,
                message: 'El comentario no puede estar vacio.',
            });
        }

        let validateValidContent = validator.isAlphanumeric(
            validator.blacklist(content, ' */@{}<>.')
        );
        if (!validateValidContent) {
            return res.status(400).send({
                status: 'error',
                error: true,
                message: 'El comentario no es valido, no introduzcas caracteres especiales.',
            });
        }

        let identity = await jwtService.getIdentity(req.headers.authorization);

        // Create comment obj for save
        let comment = {
            content: content,
            user: identity._id,
        };

        // unset values

        /*comment.user.resetPasswordExpires = undefined;
        comment.user.emailToken = undefined;
        comment.user.emailTokenExpires = undefined;
        comment.user.emailTokenExpires = undefined;
        comment.user.accessToken = undefined;*/


        // En la propiedad comments del objeto resultante hacer un push
        await topic.comments.push(comment);

        // save topic with comment
        const commentSaved = await topic.save();

        if (!commentSaved || Object.keys(commentSaved).length === 0 || commentSaved.length === 0) {
            return res.status(404).send({
                status: 'error',
                error: true,
                message: 'Error al guardar el nuevo comentario: ',
            });
        } else {
            // find populate para devolver el topic
            let topic = await Topic.findById({_id: topicId})
                .populate('user')
                .populate('comments.user')
            ;


            //TODO: delete from topic personal information password...

            // Return response.
            return res.status(201).send({
                status: 'success',
                error: false,
                message: 'Comment created successful',
                topic: topic,
            });
        }

    } catch (error) {
        console.error('create comment :', error);
        return res.status(500).send({
            status: 'error',
            error: true,
            message: 'Error when try create new comment: ' + error,
        });
    }


};


/**
 * @description Edit comment
 * @param req
 * @param res
 * @return {Promise<*>}
 */
exports.edit = async (req, res) => {
};


/**
 * @description Delete comment
 * @param req
 * @param res
 * @return {Promise<*>}
 */
exports.delete = async (req, res) => {
};
