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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const user_controller_1 = require("../controllers/user.controller");
const { verifyAuthToken } = require("../middleware/auth.middleware");
const user_controller_2 = require("../controllers/user.controller");
const user_validator_1 = require("../utils/validators/user.validator");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validators_1 = require("../utils/validators");
const router = (0, express_1.Router)();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User.find({});
    res.send(users);
}));
router.get("/profile", verifyAuthToken, user_controller_2.getUserDetails);
// {
//   username: 'John Daniels',
//   email: 'adeyemijohndaniels@gmail.com'
//   password: '1234567890'
// }
router.post("/signup", user_controller_2.signup);
// {
//   username: 'John Daniels',
//   password: '1234567890'
// }
router.post("/login", user_controller_2.login);
// /verificatiion?token=askdfr0i2dfksad;lkfpqdwiafisdfjds
router.post("/verification", user_controller_2.verifyUser);
// /verification/request/?email=test@gmail.com
router.post("/verification/request", user_controller_2.requestVerificationToken);
router.post('/auth/refresh', verifyAuthToken, user_controller_1.refreshVerificationToken);
// TODO: implement, update, delete, add validation middleware
router.put('/', verifyAuthToken, user_controller_1.updateUser);
router.delete('/', verifyAuthToken, user_controller_1.deleteUser);
// password reset
router.post('/auth/reset-password/request', user_validator_1.validateRequestResetPassword, validators_1.checkErrors, user_controller_1.requestPasswordReset); // - done
router.post('/auth/reset-password', auth_middleware_1.verifyResetPasswordToken, user_validator_1.validateResetPassword, validators_1.checkErrors, user_controller_1.resetPassword); // - done
module.exports = router;
//# sourceMappingURL=user.route.js.map