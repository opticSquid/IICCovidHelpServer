const router = require("express").Router();
const verifyjwt = require("../MiddleWares/JWT");
const deleteSession = require("../Database/Session");
const logout = (req, res) => {
  deleteSession
    .DeleteUser(res.locals.user.Email)
    .then((response) => {
      console.log(response);
      res.status(200).json({ status: "Logged Out" });
    })
    .catch((error) => {
      console.error("Error occoured while logging out the user from DB");
      res.status(200).json({ status: "Could not Log Out" });
    });
};

router.delete("/", verifyjwt.verifyJWT, logout);

module.exports = router;