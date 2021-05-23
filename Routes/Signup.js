const router = require("express").Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const user = require("../Database/User");
const sendMail = async (Email, Name, Password) => {
  let mailRoute = jwt.sign(
    { Email: Email, Name: Name, Password: Password },
    process.env.EMAILTOKEN,
    { expiresIn: 900 }
  );
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EmailSender,
      pass: process.env.AppPassword,
    },
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"myBondhu Portal" <mybondhu.covidhelp@gmail.com>', // sender address
    to: Email, // list of receivers
    subject: "Verification Mail from myBondhu", // Subject line
    html: `<b>
      Hello ${Name},
      </b>
      <div>
      <p>
      This mail is sent to you from myBondhu Portal to verify your mail address. This verification Link will be active for <strong>15 minutes</strong>. 
      </p>
      <a href=${process.env.Origin}/confirmEmail/${mailRoute} style="text-decoration: none"><button style="background-color:purple; color:white">Click this button to verify your mail</button></a>
      </div>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  return {
    MessageSent: info.messageId,
    PreviewURL: nodemailer.getTestMessageUrl(info),
  };
};
//check if the user already exists in DB
const checkifExists = (req, res, next) => {
  user
    .FindUser(req.body.Email)
    .then((response) => {
      if (response.data !== undefined) {
        console.log("Found existing user by this email in DB", response);
        res
          .status(200)
          .json({
            status:
              "An account already exists by this email, try another account",
          });
      } else {
        console.error(
          "Could not find user from DB, new user can be created",
          response
        );
        next();
      }
    })
    .catch((error) => {
      console.error(
        "Could not issue Find Command to DB This error occoured\n",
        error
      );
      next("route");
      res.status(200).json({
        status: "Could not issue Find Command in DB internal Server error",
        tokens: null,
      });
    });
};
const sendVerificationEmail = (req, res) => {
  sendMail(req.body.Email, req.body.Name, req.body.Password)
    .then((response) => {
      console.log("Response: ", response);
      res.status(200).json({ status: "Mail sent yet to be verified, remember to check your spam folder" });
    })
    .catch((error) => {
      if (error) {
        console.error("Error came while sending Email", error);
        res.status(200).json({
          status: "Mail could not be sent to the provided Email address",
        });
      }
    });
};
router.post("/", checkifExists, sendVerificationEmail);

module.exports = router;
