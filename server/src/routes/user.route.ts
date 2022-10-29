import { Router } from "express"
const jwt = require("jsonwebtoken")
const User = require("../models/User.model")

import respond from "../utils/respond"
import { deleteUser, refreshVerificationToken, requestPasswordReset, resetPassword, updateUser } from "../controllers/user.controller"
const { verifyAuthToken } = require("../middleware/auth.middleware")

import {
  signup,
  login,
  verifyUser,
  requestVerificationToken,
  getUserDetails,
} from "../controllers/user.controller"
import { validateRequestResetPassword, validateResetPassword } from "../utils/validators/user.validator"
import { verifyResetPasswordToken } from "../middleware/auth.middleware"
import { checkErrors } from "../utils/validators"

const router = Router()

router.get("/", async (req, res) => {
  const users = await User.find({})

  res.send(users)
})

router.get("/profile", verifyAuthToken, getUserDetails)

// {
//   username: 'John Daniels',
//   email: 'adeyemijohndaniels@gmail.com'
//   password: '1234567890'
// }
router.post("/signup", signup)

// {
//   username: 'John Daniels',
//   password: '1234567890'
// }
router.post("/login", login)

// /verificatiion?token=askdfr0i2dfksad;lkfpqdwiafisdfjds
router.post("/verification", verifyUser)

// /verification/request/?email=test@gmail.com
router.post("/verification/request", requestVerificationToken)

router.post('/auth/refresh', verifyAuthToken, refreshVerificationToken)
// TODO: implement, update, delete, add validation middleware
router.put('/', verifyAuthToken, updateUser)

router.delete('/', verifyAuthToken, deleteUser)


// password reset
router.post('/auth/reset-password/request', validateRequestResetPassword, checkErrors, requestPasswordReset) // - done
router.post('/auth/reset-password', verifyResetPasswordToken, validateResetPassword, checkErrors, resetPassword) // - done


module.exports = router
