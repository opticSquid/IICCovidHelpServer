require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const handlebars = require("express-handlebars");
const app = express();

const dev_config = {
  origin: "http://localhost:3000",
};
const prod_config = {
   origin: "https://www.mybondhu.in",
};
const LogOptions = {
  basePath: "Logs",
  fileName: "Server.log",
  ip: true,
  showOnConsole: true,
};
app.set("view engine", "hbs");
app.engine(
  "hbs",
  handlebars({
    extname: "hbs",
    layoutsDir: `${__dirname}/views/layouts`,
     defaultLayout: "main",
  })
);
  app.use(express.static(__dirname +'/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("express-file-logger")(app, LogOptions);
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
      res.status(200).json({ m: "Hello from myBondhu Backend" });
    });
    // app.use("/generateotp", require("./Routes/OTPgenerate"));
    // app.use("/otpconfirm", require("./Routes/OTPconfirm"));
    // app.use("/state", require("./Routes/getStates"));
    // app.use("/district", require("./Routes/getDistricts"));
    // app.use("/slots", require("./Routes/getVaccineSlots"));
    app.use("/signup", require("./Routes/Signup"));
    app.use("/confirmEmail", require("./Routes/AddVerifiedUser"));
    app.use("/login", require("./Routes/Login"));
    app.use("/logout", require("./Routes/Logout"));
    app.use("/checktoken",require("./Routes/checkToken"));
    app.use("/generatetoken", require("./Routes/generateAccessToken"));
    app.use("/newHealthCentre", require("./Routes/NewHealthCentre"));
    app.use("/getHealthCentres", require("./Routes/getHealthCentres"));
  })
  .catch((error) => {
    console.log("Could not connect to Database, this error occured=>\n", error);
  });

app.listen(port, () => console.log(`Server Running on port ${port}`));
