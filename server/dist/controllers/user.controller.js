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
const jwt = require("jsonwebtoken");
const Post = require("../models/Post.model");
const User = require("../models/User.model");
const respond = require("../utils/respond");
const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post.find({ username: req.user.username });
        const userDetails = {
            user: req.user.toJSON(),
            posts,
        };
        respond(res, 200, "Fetched user details", userDetails);
    }
    catch (e) {
        console.log(e);
        respond(res, 500, "something went wrong");
    }
});
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const credentials = Object.assign(Object.assign({}, req.body), { isVerified: false });
        const user = User(credentials);
        yield user.save();
        yield user.verify();
        res.status(201).send(user);
        respond(res, 201, "successfully registered, verification code has been sent to your email", user);
    }
    catch (e) {
        console.log(e);
        respond(res, 500, "something went wrong");
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const credentials = req.body;
        // verification wall
        const user = yield User.findOne({ email: credentials.email });
        if (!user)
            return respond(res, 404, "Couldn'nt find any user ...");
        // if we are here --- that means that the user is available.... so lets check for verification
        if (user.isVerified !== true)
            return respond(res, 403, "Pls verify your account b4 you login"); // this is a custom one for login...
        // so if we are here... it means the user is verified, now we can login :)
        const userDetails = yield User.login(credentials);
        respond(res, 200, "successfully logged in", userDetails);
    }
    catch (e) {
        console.log(e);
        respond(res, 500, "something went wrong");
    }
});
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.query.token;
        // check if it exists
        if (!token)
            return respond(res, 400, "token is required");
        // check if it's valid
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded)
            return respond(res, 400, "token is required");
        const user = yield User.findOne({ _id: decoded._id });
        if (!user)
            return respond(res, 404, "This user does not exist");
        if (user.isVerified)
            return respond(res, 200, "Nothing todo here");
        user.isVerified = true;
        user.save();
        respond(res, 200, "You have successfully verified your email");
    }
    catch (e) {
        if (e.name === "TokenExpiredError")
            return respond(res, 400, "Your token has expired, pls request for a new one");
        respond(res, 400, "Unable to verify, Please try again", e);
    }
});
const requestVerificationToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.query.email;
        if (!email)
            return respond(res, 400, "the email is required");
        const user = yield User.findOne({ email });
        if (!user)
            return respond(res, 404, "This user does not exist");
        yield user.verify();
        respond(res, 200, "Successfully processed your request");
    }
    catch (e) {
        respond(res, 500, "something went wrong");
    }
});
module.exports = {
    signup,
    login,
    getUserDetails,
    verifyUser,
    requestVerificationToken,
};
//# sourceMappingURL=user.controller.js.map