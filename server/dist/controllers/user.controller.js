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
exports.resetPassword = exports.requestPasswordReset = exports.deleteUser = exports.updateUser = exports.refreshVerificationToken = exports.requestVerificationToken = exports.verifyUser = exports.login = exports.signup = exports.getUserDetails = void 0;
const emails_1 = require("../services/emails");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = __importDefault(require("../models/User.model"));
const respond_1 = __importDefault(require("../utils/respond"));
const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDetails = {
            user: req.user.toJSON(),
        };
        (0, respond_1.default)(res, 200, "Fetched user details", userDetails);
    }
    catch (e) {
        console.log(e);
        (0, respond_1.default)(res, 500, "something went wrong");
    }
});
exports.getUserDetails = getUserDetails;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const credentials = Object.assign(Object.assign({}, req.body), { isVerified: false });
        const user = new User_model_1.default(credentials);
        yield user.save();
        yield user.verify();
        (0, respond_1.default)(res, 201, "successfully registered, verification code has been sent to your email", user);
    }
    catch (e) {
        console.log(e);
        (0, respond_1.default)(res, 500, "something went wrong");
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const credentials = req.body;
        // verification wall
        const user = yield User_model_1.default.findOne({ email: credentials.email });
        if (!user)
            return (0, respond_1.default)(res, 404, "Couldn'nt find any user ...");
        // if we are here --- that means that the user is available.... so lets check for verification
        if (user.isVerified !== true)
            return (0, respond_1.default)(res, 403, "Pls verify your account b4 you login"); // this is a custom one for login...
        // so if we are here... it means the user is verified, now we can login :)
        const userDetails = yield User_model_1.default.login(credentials);
        (0, respond_1.default)(res, 200, "successfully logged in", userDetails);
    }
    catch (e) {
        console.log(e);
        (0, respond_1.default)(res, 500, "something went wrong");
    }
});
exports.login = login;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.query.token;
        // check if it exists
        if (!token)
            return (0, respond_1.default)(res, 400, "token is required");
        // check if it's valid
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded)
            return (0, respond_1.default)(res, 400, "token is required");
        const user = yield User_model_1.default.findOne({ _id: decoded._id });
        if (!user)
            return (0, respond_1.default)(res, 404, "This user does not exist");
        if (user.isVerified)
            return (0, respond_1.default)(res, 200, "Nothing todo here");
        user.isVerified = true;
        user.save();
        (0, respond_1.default)(res, 200, "You have successfully verified your email");
    }
    catch (e) {
        if (e.name === "TokenExpiredError")
            return (0, respond_1.default)(res, 400, "Your token has expired, pls request for a new one");
        (0, respond_1.default)(res, 400, "Unable to verify, Please try again");
    }
});
exports.verifyUser = verifyUser;
const requestVerificationToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.query.email;
        if (!email)
            return (0, respond_1.default)(res, 400, "the email is required");
        const user = yield User_model_1.default.findOne({ email });
        if (!user)
            return (0, respond_1.default)(res, 404, "This user does not exist");
        yield user.verify();
        (0, respond_1.default)(res, 200, "Successfully processed your request");
    }
    catch (e) {
        (0, respond_1.default)(res, 500, "something went wrong");
    }
});
exports.requestVerificationToken = requestVerificationToken;
// users/auth/refresh?token={refreshToken}
const refreshVerificationToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = req.user;
        const token = (_a = req.query) === null || _a === void 0 ? void 0 : _a.token;
        const { type, _id } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (user._id !== _id)
            return (0, respond_1.default)(res, 403, "Pls provide a valid token");
        if (type !== JwtTokenType.refresh)
            return (0, respond_1.default)(res, 403, "Pls provide a valid token");
        const refreshedUser = yield user.refreshAuthToken();
        (0, respond_1.default)(res, 200, 'successfully refreshed your token!', refreshedUser);
    }
    catch (e) {
        if (e.name === "TokenExpiredError")
            return (0, respond_1.default)(res, 400, "Your token has expired, pls login again");
        (0, respond_1.default)(res, 400, "Unable to refresh, try again later!");
    }
});
exports.refreshVerificationToken = refreshVerificationToken;
// updated user validation
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updates = req.body;
        const user = req.user;
        const updatedUser = yield User_model_1.default.findByIdAndUpdate(user._id, updates, { new: true });
        (0, respond_1.default)(res, 200, 'succesfully updated the user', updatedUser);
    }
    catch (e) {
        (0, respond_1.default)(res, 500, "something went wrong");
    }
});
exports.updateUser = updateUser;
// delete user validation
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield req.user.remove();
        (0, respond_1.default)(res, 200, 'succesfully deleted the user');
    }
    catch (e) {
        (0, respond_1.default)(res, 500, "something went wrong");
    }
});
exports.deleteUser = deleteUser;
const requestPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // generate a token
    // send an email to the user... with the url of the frontend which take so url search params
    // take the email and the mail to it
    try {
        const { email } = req.body;
        const foundUser = yield User_model_1.default.findOne({ email });
        if (!foundUser)
            return (0, respond_1.default)(res, 404, "User with this email is not found!");
        const token = yield foundUser.generateVerificationToken();
        const clientResetPasswordpath = process.env.GREENIFY_CLIENT_URI_PASSWORD_RESET_PATH;
        const testResetPasswordpath = 'http://localhost:5000/v2/users/auth/reset-password?token='; // debug
        /**
         * clientUrl - should be this pattern
         * protocol + hostname + {password_reset_path?token=} + {token}
         * localhost example
         *                                                  {url}+{token}
         * {http://localhost:3000/recovery/reset-password/?token=}{token}
         */
        const link = `${clientResetPasswordpath}${token}`;
        const testLink = testResetPasswordpath + token; // debug
        // await sendResetPasswordEmail(foundUser, testLink)
        yield (0, emails_1.sendResetPasswordEmail)({ email: foundUser.email }, link);
        (0, respond_1.default)(res, 200, 'The Password reset link has been sent to you!');
    }
    catch (e) {
        (0, respond_1.default)(res, 500, 'something went wrong');
    }
});
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // validate the token...
    // get the new input... password
    // continue to update
    const { password } = req.body;
    req.user.password = password;
    yield req.user.save();
    (0, respond_1.default)(res, 200, 'successfully retieved your account!', req.user);
});
exports.resetPassword = resetPassword;
//# sourceMappingURL=user.controller.js.map