const router = require("express").Router();
const jwt = require("jsonwebtoken");

const checkLegitimacyofJWT = (req,res) => {
    try {
        let user = jwt.verify(req.headers.accesstoken, process.env.ACCESSTOKEN);
        console.log("Access token Verified", user);
        res.status(200).json({status: "Access token valid", accessToken: req.headers.accesstoken});
       
      } catch (error) {
        //Regenrating new token for a fiven refresh token
        console.error("Access Token Expired. Redirecting to generate token\n", error);
        res.header('refreshtoken', req.headers.refreshtoken);
        res.redirect("/generatetoken");
      }
}

router.get("/",checkLegitimacyofJWT);

module.exports = router;