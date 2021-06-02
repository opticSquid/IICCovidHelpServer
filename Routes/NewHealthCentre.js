const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const verifyjwt = require("../MiddleWares/JWT");
const addCentre = require("../Database/HealthCentre");
const newHealthCentre = (req, res, next) => {
  let body = req.body;
  console.log("Data that came: ", body);
  console.log("User that requested: ", res.locals.user);
  body.CreatorEmail = res.locals.user.Email;
  if (
    body.FacilityName !== "" &&
    body.PhoneNumber !== "" &&
    body.Address.Location !== undefined
  ) {
    // If body has all the minimum required values
    if (body.Oxygen !== NaN && body.Oxygen !== "") {
      body.Oxygen = parseInt(body.Oxygen);
    } else {
      body.Oxygen = 0;
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
    res.locals.body = body;
    next();
  } else {
    res
      .status(200)
      .json({ status: "Hospital Name, Phone Number or Location is missing" });
  }
};

//To avoid redundancy
const checkforExistingFacility = (req, res, next) => {
  //Check if the hospital already exists in database
  addCentre
    .checkExisting(res.locals.body.Address.Location)
    .then((response) => {
      // Promise can be resolved in one condition only
      console.log("If facility was not found", response);
      next();
    })
    .catch((error) => {
      console.error("check for existing facility returned an error", error);
      res.status(200).json({ status: error.status });
    });
};

const addNewCentre = (req, res) => {
  addCentre
    .AddCenter(res.locals.body)
    .then((response) => {
      console.log("Saved new centre", response);
      res.status(200).json({ status: "New Health Centre Added to DB" });
    })
    .catch((error) => {
      console.error("New health Centre could not be added=>", error);
      res.status(200).json({ status: "New Centre could not be added to DB" });
    });
};

router.post(
  "/",
  verifyjwt.verifyJWT,
  newHealthCentre,
  checkforExistingFacility,
  addNewCentre
);

module.exports = router;
