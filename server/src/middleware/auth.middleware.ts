import jwt, { JwtPayload } from "jsonwebtoken";
import respond from "../utils/respond";
import User from '../models/User.model'

const verifyAuthToken = async (req, res, next) => {
    try {
        const token = req.get("Authorization")?.split("Bearer ")[1];

        // check if it exists
        if (!token) return respond(res, 403, "Pls Authenticate");

        // check if it's valid
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

        if (decoded?.type !== JwtTokenType.auth) return respond(res, 403, "Pls provide a valid token...");
        if (!decoded) return respond(res, 403, "Pls Authenticate");

        // check if user exists
        const user = await User.findOne({
            id: decoded._id,
            "tokens.token": token,
        });
        if (!user) return respond(res, 404, "Sorry but user is not found!");

        // verificaton
        if (!user.isVerified)
            return respond(res, 403, "pls verify your account");

        req.user = user;
        req.token = token;

        next();
    } catch (e) {
        // if something went wrong
        console.log(e);
        respond(res, 403, "Pls Authenticate");
    }
};

module.exports = {
    verifyAuthToken,
};
