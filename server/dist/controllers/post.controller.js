"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Post = require("../models/Post.model");
const respond = require("../utils/respond");
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post.find();
        respond(res, 201, "Fetched all posts", posts);
    }
    catch (e) {
        console.log(e);
        respond(res, 500, "Something went wrong");
    }
});
const getAllUserPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.user;
        const posts = yield Post.find({ username });
        respond(res, 201, "Fetched all posts", posts);
    }
    catch (e) {
        console.log(e);
        respond(res, 500, "Something went wrong");
    }
});
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.user;
        const newPost = Post(Object.assign(Object.assign({}, req.body), { username }));
        const post = yield newPost.save();
        respond(res, 201, "Created new post", post);
    }
    catch ({ message }) {
        respond(res, 500, "Something went wrong", message);
    }
});
module.exports = {
    getAllPosts,
    createPost,
    getAllUserPosts,
};
//# sourceMappingURL=post.controller.js.map