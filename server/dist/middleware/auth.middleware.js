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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const respond_1 = __importDefault(require("../utils/respond"));
const User_model_1 = __importDefault(require("../models/User.model"));
const verifyAuthToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.get("Authorization")) === null || _a === void 0 ? void 0 : _a.split("Bearer ")[1];
        // check if it exists
        if (!token)
            return (0, respond_1.default)(res, 403, "Pls Authenticate");
        // check if it's valid
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if ((decoded === null || decoded === void 0 ? void 0 : decoded.type) !== JwtTokenType.auth)
            return (0, respond_1.default)(res, 403, "Pls provide a valid token...");
        if (!decoded)
            return (0, respond_1.default)(res, 403, "Pls Authenticate");
        // check if user exists
        const user = yield User_model_1.default.findOne({
            id: decoded._id,
            "tokens.token": token,
        });
        if (!user)
            return (0, respond_1.default)(res, 404, "Sorry but user is not found!");
        // verificaton
        if (!user.isVerified)
            return (0, respond_1.default)(res, 403, "pls verify your account");
        req.user = user;
        req.token = token;
        next();
    }
    catch (e) {
        // if something went wrong
        console.log(e);
        (0, respond_1.default)(res, 403, "Pls Authenticate");
    }
});
module.exports = {
    verifyAuthToken,
};
//# sourceMappingURL=auth.middleware.js.map