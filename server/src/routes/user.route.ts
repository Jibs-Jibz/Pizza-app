import { Router } from "express"
const jwt = require("jsonwebtoken")
const User = require("../models/User.model")

import respond from "@utils/respond"
import { refreshVerificationToken } from "../controllers/user.controller"
const { verifyAuthToken } = require("../middleware/auth.middleware")

const {
  signup,
  login,
  verifyUser,
  requestVerificationToken,
  getUserDetails,
} = require("../controllers/user.controller")

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

module.exports = router
