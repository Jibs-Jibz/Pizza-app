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
exports.sendVerificationMail = exports.mailer = void 0;
const path = require("path");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
// initailize nodemailer transport
exports.mailer = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});
const templatesDir = path.resolve("src/services/emails/templates");
// setup support work passing data into the html file
// using handlebars, syntax...
const handlebarOptions = {
    viewEngine: {
        extName: ".html",
        partialsDir: templatesDir,
        defaultLayout: false,
    },
    viewPath: templatesDir,
    extName: ".html",
};
exports.mailer.use("compile", hbs(handlebarOptions));
/**
 *
 * @param {string} email - the recipients email
 * @param {string} link - the verification url
 * @returns {Promise}
 */
const sendVerificationMail = (email, link) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield exports.mailer.sendMail({
            from: "Node app",
            to: email,
            subject: "Verify your mail",
            template: "email_verification",
            context: {
                link, // this is the way we pass some data to the template
            },
        });
        return result;
    }
    catch (e) {
        console.log(e);
        return e;
    }
});
exports.sendVerificationMail = sendVerificationMail;
// module.exports = {
//   mailer,
//   sendVerificationMail,
// }
//# sourceMappingURL=index.js.map