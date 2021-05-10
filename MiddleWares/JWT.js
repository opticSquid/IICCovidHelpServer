const jwt = require("jsonwebtoken");

const SetJWT_SignUP = (req, res, next) => {
  const refreshToken = jwt.sign(
    res.locals.usertoSend,
    process.env.REFRESHTOKEN
  );
  const accessToken = jwt.sign(res.locals.usertoSend, process.env.ACCESSTOKEN, {
    expiresIn: 900,
  });
  res.locals.jwt = {
    refreshToken: refreshToken,
    accessToken: accessToken,
    Name: res.locals.VerifiedUser.Name,
  };
  next();
};
const SetJWT_Login = (req, res, next) => {
  const refreshToken = jwt.sign(
    res.locals.usertoSend,
    process.env.REFRESHTOKEN
  );
  const accessToken = jwt.sign(res.locals.usertoSend, process.env.ACCESSTOKEN, {
    expiresIn: 900,
  });
  res.locals.jwt = {
    refreshToken: refreshToken,
    accessToken: accessToken,
    Name: res.locals.usertoSend.Name,
  };
  next();
};

const VerifyJWT = (req, res, next) => {
  try {
    let user = jwt.verify(req.headers.accesstoken, process.env.ACCESSTOKEN);
    console.log("Access token Verified", user);
    res.locals.user = { Email: user.Email, Name: user.Name };
    next();
  } catch (error) {
    console.error("Access Token Expired\n", error);
    next("route");
    res.status(200).json({ m: "Access Token Expired" });
  }
};

const verifyUser = (req, res, next) => {
  try {
    console.log("Request Params: ", req.params);
    let user = jwt.verify(req.params.token, process.env.EMAILTOKEN);
    console.log("Email Verified", user);
    res.locals.VerifiedUser = {
      Email: user.Email,
      Name: user.Name,
      Password: user.Password,
    };
    next();
  } catch (error) {
    console.error("Email token is tampered\n", error);
    next("route");
    res
      .status(200)
      .json({ status: "Email verification link has been tampered with" });
  }
};

module.exports = {
  SetJWT_SignUP: SetJWT_SignUP,
  SetJWT_Login: SetJWT_Login,
  verifyJWT: VerifyJWT,
  VerifyUser: verifyUser,
};
