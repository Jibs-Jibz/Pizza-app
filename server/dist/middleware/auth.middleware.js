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
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const respond = require("../utils/respond");
const verifyAuthToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.get("Authorization")) === null || _a === void 0 ? void 0 : _a.split("Bearer ")[1];
        // check if it exists
        if (!token)
            return respond(res, 403, "Pls Authenticate");
        // check if it's valid
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded)
            return respond(res, 403, "Pls Authenticate");
        // check if user exists
        const user = yield User.findOne({
            id: decoded._id,
            "tokens.token": token,
        });
        if (!user)
            return respond(res, 404, "Sorry but user is not found!");
        // verificaton
        if (!user.isVerified)
            return respond(res, 403, "pls verify your account");
        req.user = user;
        req.token = token;
        next();
    }
    catch (e) {
        // if something went wrong
        console.log(e);
        respond(res, 403, "Pls Authenticate");
    }
});
module.exports = {
    verifyAuthToken,
};
//# sourceMappingURL=auth.middleware.js.map