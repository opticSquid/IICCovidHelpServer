const jwt = require("jsonwebtoken");

const SetJWT = (req, res,next) => {
  const refreshToken = jwt.sign(
    res.locals.usertoSend,
    process.env.REFRESHTOKEN
  );
  const accessToken = jwt.sign(res.locals.usertoSend, process.env.ACCESSTOKEN, {
    expiresIn: 900,
  });
  res.locals.jwt = { refreshToken: refreshToken, accessToken: accessToken };
  next();
};

const VerifyJWT = (req, res, next) => {
  try {
    let user = jwt.verify(req.headers.accesstoken, process.env.ACCESSTOKEN);
    console.log("Access token Verified", user);
    res.locals.user = {Email: user.Email, Name: user.Name};
    next();
  } catch (error) {
    console.error("Access Token Expired\n", error);
    next("route");
    res.status(200).json({ m: "Access Token Expired" });
  }
};

module.exports = { setJWT: SetJWT, verifyJWT: VerifyJWT };
