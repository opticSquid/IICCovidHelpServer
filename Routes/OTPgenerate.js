const router = require("express").Router();
const axios = require("axios").default;

router.get("/", (req, res) => {
  let doc = {
    mobile: req.body.mobile,
  };
  axios
    .post("https://cdn-api.co-vin.in/api/v2/auth/public/generateOTP", doc)
    .then((response) => {
      console.log(response.data);
      res.status(200).json({ m: "Response Sent" });
    })
    .catch((err) => {
      console.log(
        "Couldnot generate OTP for the given number. This error occured=>\n",
        err
      );
    });
});
module.exports = router;