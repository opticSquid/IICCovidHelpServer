const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const addUser = require("../Database/NewUser");
const hashPassword = async (pass) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(pass, saltRounds);
  return hash;
};

const NewUser = (req, res, next) => {
  const body = req.body;
  hashPassword(body.Password)
    .then((hash) => {
      res.locals.passHash = hash;
      next();
    })
    .catch((error) => {
      console.log("Could not generate hash for the given passwords");
      next("route");
    });
};

const SaveUser = (req, res, next) => {
  let User = {
    Email: req.body.Email,
    Name: req.body.Name,
    Password: res.locals.passHash,
  };
  addUser
    .AddUser(User)
    .then((response) => {
      console.log("From DB", response);
      if (response.error === null) {
        res.locals.usertoSend = {
          Email: response.data.Email,
          Name: response.data.Name,
        };
        next();
      }
      else
      {
          console.log("Error occoured while saving user to DB", response.error);
          next('route');
      }
    })
    .catch((error) => {
      console.log("Promise of saving User to Database got Rejected", error);
      next("route");
    });
};
const setJWT = (req, res) => {
  const refreshToken = jwt.sign(
    res.locals.usertoSend,
    process.env.REFRESHTOKEN
  );
  const accessToken = jwt.sign(res.locals.usertoSend, process.env.ACCESSTOKEN, {
    expiresIn: 900,
  });
  res
    .status(200)
    .json({ refreshToken: refreshToken, accessToken: accessToken });
};
router.post("/", NewUser, SaveUser, setJWT);

module.exports = router;
