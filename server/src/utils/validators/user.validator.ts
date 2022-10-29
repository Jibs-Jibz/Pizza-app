import { body, validationResult } from "express-validator";

export const validateLogin = [
        body("username").exists({ checkNull: true, checkFalsy: true })
                .trim()
                .withMessage("Username is required"),

        body("password")
                .exists({ checkNull: true, checkFalsy: true },)
                .trim()
                .isLength({ min: 8 })
                .withMessage("Password must have at least 8 characters"),
]


export const validateRequestResetPassword = [
        body("email")
                .exists({ checkNull: true, checkFalsy: true })
                .trim()
                .isEmail()
                .withMessage("Provide a valid email"),
]



export const validateResetPassword = [
        body("password")
                .exists({ checkNull: true, checkFalsy: true },)
                .trim()
                .isLength({ min: 8 })
                .withMessage("Password must have at least 8 characters"),
]

// using express validator middleware to check for errors in all fields for user model.
export const validateSignup = [
        body("fullname")
                .exists({ checkNull: true, checkFalsy: true })
                .isLength({ min: 3 })
                .withMessage("fullname name must have at least 3 characters"),

        body("username")
                .exists({ checkNull: true, checkFalsy: true })
                .trim()
                .withMessage("username is required")
                .isLength({ min: 3 })
                .withMessage("username must contain at least 3 characters."),

        body("email")
                .exists({ checkNull: true, checkFalsy: true })
                .trim()
                .isEmail()
                .withMessage("Provide a valid email"),

        body("phone").custom(async (value: string) => {
                if (value) {
                        if (value.length < 3) {
                                throw new Error('Please enter a valid phone number')
                        }
                }
        }),
        body("password")
                .exists({ checkNull: true, checkFalsy: true })
                .trim()
                .isLength({ min: 8 })
                .withMessage("Password must have at least 8 characters"),
        body("location").custom(async (location: string) => {
                if (location) {
                        if (location.length < 3) {
                                throw new Error('please provide a valid location')
                        }
                }
        }),
]

