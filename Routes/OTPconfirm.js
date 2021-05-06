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
    txnId: '8fb9fadf-213e-4f71-94d1-04244c2faf96',
  };
  console.log(doc);
  axios.post("https://cdn-api.co-vin.in/api/v2/auth/public/confirmOTP",doc).then((response)=>{
      console.log(response.data);
      res.status(200).json({m:"OTP verified"});
  }).catch((err)=>{
      console.log("Error occoured =>\n",err);
  });
});
module.exports = router;