"use strict";

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

// Comment Model
const CommentSchema = new Schema(
    {
        content: {
            type: String,
            trim: true,
            required: true,
        },
        user: {type: Schema.ObjectId, ref: "User"},
    },
    {timestamps: true}
);

// if we need export comment object
var Comment = mongoose.model("Comment", CommentSchema);

// Topic Model
const TopicSchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
            required: [true, "can't be blank"],
            match: [/^[a-zA-Z0-9*/@{}<>. ]+$/, "is invalid"],
        },
        content: {
            type: String,
            trim: true,
            required: [true, "can't be blank"],
            //match: [/^[a-zA-Z0-9*/@{}<>. ]+$/, "is invalid"],
        },
        code: {
            type: String,
            trim: true,
        },
        lang: {
            type: String,
            trim: true,
        },
        user: {type: Schema.ObjectId, ref: "User"},
        comments: [CommentSchema],
    },
    {timestamps: true}
);

TopicSchema.plugin(uniqueValidator, {message: "is already taken."});

module.exports = mongoose.model("Topic", TopicSchema);
