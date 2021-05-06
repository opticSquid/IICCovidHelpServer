const express = require("express");
const router = express.Router();
const axios = require("axios").default;

router.get("/", (req, res) => {
  axios.get(`${process.env.cowinOrigin}/v2/admin/location/states`, {
    headers: {
      "Accept-Language": "hi_IN",
      token:
        process.env.cowinToken,
    },
  }).then((response)=>{
      res.send(response.data);
  }).catch((err)=>{
      console.log("err\n",err);
      res.send("404");
  });
});
module.exports = router;
