import jwt, { JwtPayload } from "jsonwebtoken";
import respond from "../utils/respond";
import User from '../models/User.model'
import { NextFunction, Request, Response } from "express";

export const verifyAuthToken = async (req: any, res: Response, next: NextFunction) => {
    try {
        const token = req.get("Authorization")?.split("Bearer ")[1];

        // check if it exists
        if (!token) return respond(res, 401, "Pls Authenticate");

        // check if it's valid
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

        if (decoded?.type !== JwtTokenType.auth) return respond(res, 401, "Pls provide a valid token...");
        if (!decoded) return respond(res, 401, "Pls Authenticate");

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
        respond(res, 401, "Pls Authenticate");
    }
};


export const verifyAdminToken = async (req: any, res: Response, next: NextFunction) => {

    verifyAuthToken(req, res, () => {
        if (!req.user.isAdmin) return respond(res, 403, 'You not allowed to do that!')

        next()
    })

}



export const verifyResetPasswordToken = async (req: any, res: Response, next: NextFunction) => {

    const { token } = req.query

    if (!token) return respond(res, 403, 'Your token is either invalid or expired')

    let decoded: any;

    jwt.verify(token, (process.env.JWT_SECRET as string), (err, decodedVal) => {
        if (err) return respond(res, 403, 'Your token is either invalid or expired')

        decoded = decodedVal
    })

    if (!decoded) return respond(res, 403, 'Your token is either invalid or expired')

    const user = await User.findOne({ _id: decoded._id })
    if (!user) return respond(res, 404, 'Sorry but this user is not found!')

    req.user = user


    next()
}

// module.exports = {
//     verifyAuthToken,
// };
