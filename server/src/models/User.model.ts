import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sendVerificationMail } from "../services/emails"

const userSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
)

// this is a cleaner method of hiding your user data... that needs to be protected
userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}

userSchema.methods.generateAuthToken = async function () {
  const user = this

  const accessToken = jwt.sign({ _id: user._id, type: JwtTokenType.auth }, process.env.JWT_SECRET as string)
  const refeshToken = jwt.sign({ _id: user._id, type: JwtTokenType.refresh }, process.env.JWT_SECRET as string)

  user.tokens = user.tokens.concat({ accessToken, refeshToken })
  await user.save()

  return { accessToken, refeshToken }
}

userSchema.methods.generateVerificationToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: 600, // expire time is very important for verifications
  })

  return token
}

userSchema.methods.verify = async function () {
  const user = this

  const token = await user.generateVerificationToken()

  //note: CLIENT_REQUEST_TOKEN_PATH must follow this pattern http://localhost:3000/auth/verify?token=
  const client_path = process.env.CLIENT_REQUEST_TOKEN_PATH
  const link = `${client_path}${token}`

  return await sendVerificationMail(user.email, link)
}

userSchema.statics.login = async (credentials) => {
  const { password, ...credential } = credentials // life is not hard (*_*)
  const user: any = await User.findOne(credential)

  if (!user) {
    throw new Error("pls provide valid credentials")
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    // lets just keep it simple ooh! hacker go give u nightmare :)
    throw new Error("pls provide valid credentials")
  }

  const tokens = await user.generateAuthToken()
  const obscuredUser = user.toJSON()

  return { ...obscuredUser, ...tokens, }
}

userSchema.methods.refreshAuthToken = async function () {
  const user = this

  const tokens = await user.generateAuthToken()
  const obscuredUser = user.toJSON()

  return { ...obscuredUser, ...tokens, }

}

userSchema.pre("save", async function (next) {
  const user: any = this

  // hash the password, each time it gets updated
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8)
  }
})

const User = mongoose.model("users", userSchema)


export default User
// module.exports = User
