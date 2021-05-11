const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const verifyjwt = require("../MiddleWares/JWT");
const addCentre = require("../Database/HealthCentre");
const e = require("express");
const newHealthCentre = (req, res, next) => {
  let body = req.body;
  console.log("Data that came: ", body);
  console.log("User that requested: ", res.locals.user);
  body.CreatorEmail = res.locals.user.Email;
  if (body.Oxygen !== NaN && body.Oxygen !== "") {
    body.Oxygen = parseInt(body.Oxygen);
  } else {
    body.Oxygen = 0;
  }
  if (body.PhoneNumber !== NaN && body.PhoneNumber !== "") {
    body.PhoneNumber = parseInt(body.PhoneNumber);
  } else {
    body.PhoneNumber = 0;
  }
  if (body.Beds.ICU !== NaN && body.Beds.ICU !== "") {
    body.Beds.ICU = parseInt(body.Beds.ICU);
  } else {
    body.Beds.ICU = 0;
  }
  if (body.Beds.Normal !== NaN && body.Beds.Normal !== "") {
    body.Beds.Normal = parseInt(body.Beds.Normal);
  } else {
    body.Beds.Normal = 0;
  }
  if (
    body.CovidVaccines.Quantity !== NaN &&
    body.CovidVaccines.Quantity !== ""
  ) {
    body.CovidVaccines.Quantity = parseInt(body.CovidVaccines.Quantity);
  } else {
    body.CovidVaccines.Quantity = 0;
  }
  if (body.Doctors !== NaN && body.Doctors !== "") {
    body.Doctors = parseInt(body.Doctors);
  } else {
    body.Doctors = 0;
  }
  //Check wheather body has an uid key
  if (!body.uid) {
    body.uid = uuidv4();
  }
  console.log("Final body to add to DB\n", body);
  addCentre
    .AddCenter(body)
    .then((response) => {
      console.log("Saved new centre", response);
      res.status(200).json({ status: "New Health Centre Added to DB" });
    })
    .catch((error) => {
      console.error("New health Centre could not be added=>", error);
      res
        .status(200)
        .json({ status: "New Health Centre could not be Added to DB" });
    });
};

router.post("/", verifyjwt.verifyJWT, newHealthCentre);

module.exports = router;
