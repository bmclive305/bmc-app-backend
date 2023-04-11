// app.js
const controller = require("./app/controllers/user.controller");
// // const { verifySignUp } = require("./app/middleware");
const signup = require("./app/signup");
const signin = require("./app/signin");
// const deck = require("./app/deck");
// const spades = require("./app/spades");

const express = require('express')
const sls = require('serverless-http')
const app = express()


app.get('/', async (req, res, next) => {
  res.status(200).send('Welcome to BMC App')
})

app.get("/test/all", controller.allAccess);

app.get(
  "/test/user",
  controller.userBoard
);

app.get(
  "/test/admin",
  controller.adminBoard
);

app.post(
  "/auth/signup",
  signup.signup
);

app.post(
  "/auth/signin",
  signin.signin
);

// app.get(
//   "/spades/new",
//   spades.createNewGame
// );

module.exports.server = sls(app)

console.log("here")

