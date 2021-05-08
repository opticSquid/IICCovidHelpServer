const router = require("express").Router();
const verifyjwt = require("../MiddleWares/JWT");
const addCentre = require("../Database/HealthCentre");
const newHealthCentre = (req,res,next) =>{
    let body = req.body;
    console.log("Data that came: ", body);
    console.log("User that requested: ", res.locals.user);
    body.CreatorEmail = res.locals.user.Email;
    addCentre.AddCenter(body).then((response)=>{
        console.log("Saved new centre",response);
        res.status(200).json({status: "New Health Centre Added to DB"});
    }).catch((error)=>{
        console.error("New health Centre could not be added=>",error);
        res.status(200).json({status: "New Health Centre could not be Added to DB"});
    });
}

router.post("/",verifyjwt.verifyJWT,newHealthCentre);

module.exports = router;
