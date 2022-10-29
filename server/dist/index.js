"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const { config } = require("dotenv");
config();
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
// start the db
require("./db");
// routes
const userRouter = require("./routes/user.route");
const app = express();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)());
((_a = app === null || app === void 0 ? void 0 : app.settings) === null || _a === void 0 ? void 0 : _a.env) === 'development' && app.use((0, morgan_1.default)('dev'));
app.use(express.json());
app.use("/users", userRouter);
app.get("/", (req, res) => {
    res.send("Welcome to the api!!!");
});
app.listen(port, console.log(`[server]: Your API is up on port ${port}`));
//# sourceMappingURL=index.js.map