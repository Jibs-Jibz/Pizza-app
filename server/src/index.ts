const express = require("express")
const { config } = require("dotenv")
config()

import cors from 'cors'
import fs from 'fs'
import morgan from 'morgan'

// start the db
require("./db")

// routes
const userRouter = require("./routes/user.route")

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app?.settings?.env === 'development' && app.use(morgan('dev'))
app.use(express.json())

app.use("/users", userRouter)

app.get("/", (req, res) => {
  res.send("Welcome to the api!!!")
})

app.listen(port, console.log(`[server]: Your API is up on port ${port}`))
