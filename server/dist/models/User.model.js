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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emails_1 = require("../services/emails");
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: String,
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    tokens: [
        {
            accessToken: String,
            refeshToken: String,
        },
    ], // i will be using this bcuz i am just testing...
}, {
    timestamps: true,
});
// this is a cleaner method of hiding your user data... that needs to be protected
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
};
userSchema.methods.generateAuthToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        const accessToken = jsonwebtoken_1.default.sign({ _id: user._id, type: JwtTokenType.auth }, process.env.JWT_SECRET);
        const refeshToken = jsonwebtoken_1.default.sign({ _id: user._id, type: JwtTokenType.refresh }, process.env.JWT_SECRET);
        user.tokens = user.tokens.concat({ accessToken, refeshToken });
        yield user.save();
        return { accessToken, refeshToken };
    });
};
userSchema.methods.generateVerificationToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: 600, // expire time is very important for verifications
        });
        return token;
    });
};
userSchema.methods.verify = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        const token = yield user.generateVerificationToken();
        //note: CLIENT_REQUEST_TOKEN_PATH must follow this pattern http://localhost:3000/auth/verify?token=
        const client_path = process.env.CLIENT_REQUEST_TOKEN_PATH;
        const link = `${client_path}${token}`;
        return yield (0, emails_1.sendVerificationMail)(user.email, link);
    });
};
userSchema.statics.login = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = credentials, credential = __rest(credentials, ["password"]); // life is not hard (*_*)
    const user = yield User.findOne(credential);
    if (!user) {
        throw new Error("pls provide valid credentials");
    }
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        // lets just keep it simple ooh! hacker go give u nightmare :)
        throw new Error("pls provide valid credentials");
    }
    const tokens = yield user.generateAuthToken();
    const obscuredUser = user.toJSON();
    return Object.assign(Object.assign({}, obscuredUser), tokens);
});
userSchema.methods.refreshAuthToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        const tokens = yield user.generateAuthToken();
        const obscuredUser = user.toJSON();
        return Object.assign(Object.assign({}, obscuredUser), tokens);
    });
};
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        // hash the password, each time it gets updated
        if (user.isModified("password")) {
            user.password = yield bcrypt_1.default.hash(user.password, 8);
        }
    });
});
const User = mongoose_1.default.model("users", userSchema);
exports.default = User;
// module.exports = User
//# sourceMappingURL=User.model.js.map