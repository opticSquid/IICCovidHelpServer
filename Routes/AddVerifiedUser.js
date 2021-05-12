const app = require("express");
const router = app.Router();
const bcrypt = require("bcrypt");
const jwt = require("../MiddleWares/JWT");
const addUser = require("../Database/NewUser");

const hashPassword = async (pass) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(pass, saltRounds);
  return hash;
};

const NewUser = (req, res, next) => {
  const body = res.locals.VerifiedUser;
  hashPassword(body.Password)
    .then((hash) => {
      res.locals.passHash = hash;
      next();
    })
    .catch((error) => {
      console.log("Could not generate hash for the given passwords", error);
      next("route");
    });
};

const SaveUser = (req, res) => {
  let User = {
    Email: res.locals.VerifiedUser.Email,
    Name: res.locals.VerifiedUser.Name,
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
        res.render('main',{Name: response.data.Name, Email: response.data.Email});
      } else {
        console.log("Error occoured while saving user to DB", response.error);
      }
    })
    .catch((error) => {
      console.log("Promise of saving User to Database got Rejected", error);
    });
};


router.get(
  "/:token",
  jwt.VerifyUser,
  NewUser,
  SaveUser,
);

module.exports = router;
