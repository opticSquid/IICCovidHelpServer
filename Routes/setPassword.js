const router = require("express").Router();
const bcrypt = require("bcryptjs");
const user = require("../Database/User");
const hashPassword = async (pass) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(pass, saltRounds);
  return hash;
};
const newPassword = (req, res, next) => {
  let pass = req.body.password;
  let email = req.body.email;
  console.log("password", pass);
  user.FindUser(email).then((response) => {
    if (response.data) {
      hashPassword(pass)
        .then((hash) => {
          res.locals.passHash = hash;
          next();
        })
        .catch((error) => {
          console.log("Could not generate hash for the given passwords", error);
        });
    }
    else
    {
        res.status(200).json({status: "No User of this email exists in our records"});
    }
  });
};
const setPassword = (req, res) => {
  user
    .ResetPassword(req.body.email, res.locals.passHash)
    .then((response) => {
      console.log("Response of setting Password", response);
      res.render("passResetSuccess", { Email: req.body.email });
    })
    .catch((error) => {
      alert("Error occoured while changing Password\n", error);
    });
};
router.post("/", newPassword, setPassword);
module.exports = router;
