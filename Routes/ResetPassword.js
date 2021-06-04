const router = require("express").Router();
const jwt = require("../MiddleWares/JWT");
const user = require("../Database/User");
const checkUser = (req,res,next) => {
    let Email = res.locals.VerifiedUser.Email;
    console.log("Decoded User =",res.locals.VerifiedUser.Email);
    //Double CHecking if User Exists in DB
    user.FindUser(Email).then((response)=>{
        if(response.data.Email === Email)
        {
            //User exists in DB
            res.locals.Name = response.data.Name;
            console.log("Found User", response);
            next();
        }
        else
        {
            res.status(200).json({status: "No User of this email exists in our records"});
        }
    }).catch((error)=>{
        res.status(200).json({status: "Could not perform Find User Query", error: error});
    });
}
const createPassword = (req,res) => {
    res.render("resetPass",{Name: res.locals.Name, Email: res.locals.VerifiedUser.Email});
}
router.get("/:token",jwt.VerifyUser,checkUser,createPassword);
module.exports = router;