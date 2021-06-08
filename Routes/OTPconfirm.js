const express = require("express");
const router = express.Router();
const axios = require("axios").default;
const crypto = require("crypto");
const hashOTP = (pass) => {
  let otp = crypto.createHash("sha256").update(pass).digest("hex");
  return otp;
};
router.get("/", (req, res) => {
  let otp = req.body.otp;
  let doc = {
    otp: hashOTP(otp),
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
    txnId: req.body.txnid,
  };
  console.log(doc);
  axios
    .post("https://cdn-api.co-vin.in/api/v2/auth/public/confirmOTP", doc)
    .then((response) => {
      console.log(response.data);
      res.status(200).json({ m: "OTP verified" });
    })
    .catch((err) => {
      console.log("Error occoured =>\n", err);
    });
});
module.exports = router;
