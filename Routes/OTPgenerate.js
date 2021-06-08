var router = require("express").Router();
var axios = require("axios").default;
const OTPReciever = (req, res, next) => {
  var data = JSON.stringify({
    mobile: "8617882389",
  });

  var config = {
    method: "post",
    url: "https://cdn-api.co-vin.in/api/v2/auth/public/generateOTP",
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      res.status(200).json({ status: "ok" });
    })
    .catch(function (error) {
      console.log(error);
    });
};
router.get("/", OTPReciever);
module.exports = router;
