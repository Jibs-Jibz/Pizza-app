import jwt from "jsonwebtoken";
import User from "../models/User.model";
import respond from "../utils/respond";

export const getUserDetails = async (req, res) => {
    try {
        const userDetails: any = {
            user: req.user.toJSON(),
        };

        respond(res, 200, "Fetched user details", userDetails);
    } catch (e) {
        console.log(e);
        respond(res, 500, "something went wrong");
    }
};

export const signup = async (req, res) => {
    try {
        const credentials: any = { ...req.body, isVerified: false };
        const user: any = new User(credentials);

        await user.save();

        await user.verify();
        res.status(201).send(user);

        respond(
            res,
            201,
            "successfully registered, verification code has been sent to your email",
            user
        );
    } catch (e) {
        console.log(e);
        respond(res, 500, "something went wrong");
    }
};

export const login = async (req, res) => {
    try {
        const credentials = req.body;

        // verification wall
        const user = await User.findOne({ email: credentials.email });
        if (!user) return respond(res, 404, "Couldn'nt find any user ...");

        // if we are here --- that means that the user is available.... so lets check for verification
        if (user.isVerified !== true)
            return respond(res, 403, "Pls verify your account b4 you login"); // this is a custom one for login...

        // so if we are here... it means the user is verified, now we can login :)
        const userDetails = await (User as any).login(credentials);
        respond(res, 200, "successfully logged in", userDetails);
    } catch (e) {
        console.log(e);
        respond(res, 500, "something went wrong");
    }
};

export const verifyUser = async (req, res) => {
    try {
        const token = req.query.token;

        // check if it exists
        if (!token) return respond(res, 400, "token is required");

        // check if it's valid
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        if (!decoded) return respond(res, 400, "token is required");

        const user = await User.findOne({ _id: decoded._id });
        if (!user) return respond(res, 404, "This user does not exist");

        if (user.isVerified) return respond(res, 200, "Nothing todo here");

        user.isVerified = true;
        user.save();

        respond(res, 200, "You have successfully verified your email");
    } catch (e: any) {
        if (e.name === "TokenExpiredError")
            return respond(
                res,
                400,
                "Your token has expired, pls request for a new one"
            );

        respond(res, 400, "Unable to verify, Please try again");
    }
};

export const requestVerificationToken = async (req, res) => {
    try {
        const email = req.query.email;

        if (!email) return respond(res, 400, "the email is required");

        const user: any = await User.findOne({ email });
        if (!user) return respond(res, 404, "This user does not exist");

        await user.verify();
        respond(res, 200, "Successfully processed your request");
    } catch (e) {
        respond(res, 500, "something went wrong");
    }
};

// users/auth/refresh?token={refreshToken}
export const refreshVerificationToken = async (req, res) => {
    try {
        const user: UserPayload = req.user;
        const token = req.query?.token;

        const { type, _id }: any = jwt.verify(token, process.env.JWT_SECRET as string);

        if (user._id !== _id)
            return respond(res, 403, "Pls provide a valid token");

        if (type !== JwtTokenType.refresh)
            return respond(res, 403, "Pls provide a valid token");

        const refreshedUser = await user.refreshAuthToken();

        respond(res, 200, 'successfully refreshed your token!', refreshedUser)
    } catch (e: any) {
        if (e.name === "TokenExpiredError")
            return respond(res, 400, "Your token has expired, pls login again");

        respond(res, 400, "Unable to refresh, try again later!");
    }
};

