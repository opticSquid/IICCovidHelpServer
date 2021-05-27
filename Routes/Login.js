const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("../MiddleWares/JWT");
const findUser = require("../Database/User");
const addSession = require("../Database/Session");
const login = (req, res, next) => {
  findUser
    .FindUser(req.body.Email)
    .then((response) => {
      if (response.data !== undefined) {
        console.log("Found user from DB", response);
        // Name and password is passed to next middleware
        res.locals.user = response.data;
        next();
      } else {
        console.error("Could not find user from DB", response);
        // Name and password is passed to next middleware
        
        res.status(200).json({status: "User doesn't Exist", tokens: null});
      }
    })
    .catch((error) => {
      console.error(
        "Could not issue Find Command to DB This error occoured\n",
        error
      );
      
      res.status(200).json({status: "Could not issue Find Command in DB internal Server error", tokens: null});
    });
};
const comparepass = async (password, hash) => {
  try {
    //returns true if matches
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error("Error while comapring Passwords=>\t", error);
  }
  return false;
};
const verifypass = (req, res, next) => {
  comparepass(req.body.Password, res.locals.user.Password)
    .then((matched) => {
      if (matched) {
        res.locals.usertoSend = {
          Email: req.body.Email,
          Name: res.locals.user.Name,
        };
        console.log("User to send", res.locals.usertoSend);
        next();
      } else {
        res.status(200).json({ status: "Incorrect Password", tokens: null });
      }
    })
    .catch((error) => {
      console.error("Error while comparing Passwords", error);
      res.status(200).json({ status: "Password could not be compared", tokens: null });
    });
};

const startSession = (req, res) => {
  let activeUser = {
    Email: req.body.Email,
    Refresh_Token: res.locals.jwt.refreshToken,
  };
  addSession
    .AddSession(activeUser)
    .then((response) => {
      console.log(response);
      res.status(200).json({status: "Logged in successfully" ,tokens: res.locals.jwt});
    })
    .catch((err) => {
      console.error(err);
      res.status(200).json({status: "Session couldnot be started, User is logged in from another Device", tokens: null});
    });
};

router.post("/", login, verifypass, jwt.SetJWT_Login, startSession);
module.exports = router;
