const jwt = require("jsonwebtoken");

const SetJWT = (req, res) => {
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

const VerifyJWT = (req, res, next) => {
  try {
    let user = jwt.verify(req.body.accessToken, process.env.ACCESSTOKEN);
    console.log("Access token Verified", user);
    res.locals.user = user;
    next();
  } catch (error) {
    console.error("Access Token Expired\n", error);
    next("route");
    res.status(200).json({ m: "Access Token Expired" });
  }
};

module.exports = { setJWT: SetJWT, verifyJWT: VerifyJWT };
