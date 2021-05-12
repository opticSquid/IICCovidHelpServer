const router = require("express").Router();
const findHealthCentre = require("../Database/HealthCentre");
const getHealthCentres = (req, res) => {
  let body = req.body;
  //let doc = {Location: <Location/>, Radius: <Radius/> SortBy: <Sortby/>}
  findHealthCentre
    .GetNearbyCenter(body.Location, parseInt(body.Radius), body.SortBy)
    .then((response) => {

      //console.log("Found this Centres", response);
      res.status(200).json({ Centres: response });
    })
    .catch((error) => {
      console.log("Find Centres query returned an Error", error);
      res.status(200).json({ Centres: null });
    });
};

router.post("/", getHealthCentres);

module.exports = router;
