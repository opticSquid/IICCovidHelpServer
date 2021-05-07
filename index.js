require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

const dev_config = {
  origin: "http://localhost:3000",
};
const prod_config = {
  //   origin: "https://brave-hopper-919f2d.netlify.app",
  origin: "",
};
const LogOptions = {
  basePath: 'Logs',
  fileName: 'Server.log',
  ip: true,
  showOnConsole: true
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('express-file-logger')(app, LogOptions);
app.use(cors(process.env.NODE_ENV === "production" ? prod_config : dev_config));
const port = process.env.PORT || 5000;
mongoose
  .connect(process.env.DBURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((connection) => {
    app.get("/", (req, res) => {
      res.status(200).json({m:"Hello from myBondhu Backend"});
    });
    app.use("/generateotp",require("./Routes/OTPgenerate"));
    app.use("/otpconfirm", require("./Routes/OTPconfirm"));
    app.use("/state", require("./Routes/getStates"));
    app.use("/district", require("./Routes/getDistricts"));
    app.use("/slots", require("./Routes/getVaccineSlots"));
    app.use("/signup",require("./Routes/Signup"));
    app.use("/login",require("./Routes/Login"));
  }).catch((error)=>{
    console.log("Could not connect to Database, this error occured=>\n",error);
  });

app.listen(port, () => console.log(`Server Running on port ${port}`));
