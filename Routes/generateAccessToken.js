const router = require("express").Router();
const jwt = require("jsonwebtoken");
const findSession = require("../Database/FindSession");
const checkSession = (req, res, next) => {
  console.log("token:",req.headers.refreshtoken);
  let refreshToken = req.headers.refreshtoken;
  let user = jwt.verify(refreshToken, process.env.REFRESHTOKEN);
  findSession
    .FindSession(user.Email)
    .then((response) => {
      if (response.data !== undefined) {
        res.locals.activeUser = { Email: user.Email, Name: user.Name };
        next();
      } else {
        console.error("User session could not be found");
        next("route");
        res.status(200).json("User session not found");
      }
    })
    .catch((error) => {
      next("route");
      console.error("Find user session query could not be performed", error);
      res.status(200).json("Find user session query could not be performed");
    });
};
const genAccessToken = (req, res) => {
  let accessToken = jwt.sign(res.locals.activeUser, process.env.ACCESSTOKEN, {
    expiresIn: 900,
  });
  res.status(200).json({ refreshToken: req.headers.refreshtoken, accessToken: accessToken });
};
router.get("/", checkSession, genAccessToken);

module.exports = router;
