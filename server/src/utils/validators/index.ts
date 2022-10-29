import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

// function to return errors compiled together in an array as feedback for user registation.
export function checkErrors(req: Request, res: Response, next: NextFunction) {
        let errorValidation = validationResult(req);
        const errors: any = {}
        if (!errorValidation.isEmpty()) {
                // this will minify the errors for the frontend guys
                for (let error of errorValidation?.array({ onlyFirstError: true })) {
                        console.log(error)
                        const { param, msg } = error

                        errors[param] = msg
                }


                return res.status(400).send(errors);
        }
        return next();
}