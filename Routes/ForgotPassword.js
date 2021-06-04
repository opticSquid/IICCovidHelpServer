const router = require("express").Router();
const user = require("../Database/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const ifUserExists = (req, res, next) => {
  let Email = req.body.Email;
  user
    .FindUser(Email)
    .then((response) => {
      console.log(response);
      // res.status(200).json({status: "Existing User found"});
      res.locals.Name = response.data.Name;
      next();
    })
    .catch((error) => {
      console.log(error);
      res.status(200).json({ status: "User Not Found" });
    });
};
const sendEmail = async (Email, Name) => {
  let ResetLink = jwt.sign({ Email: Email }, process.env.EMAILTOKEN, {
    expiresIn: 900,
  });
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
    subject: "Password Rest Link from myBondhu", // Subject line
    html: `<b>
      Hello ${Name},
      </b>
      <div>
      <p>
      This mail is sent to you from myBondhu Portal to reset your Password. This Passowrd Rest link Link will be active for <strong>15 minutes</strong> only. 
      </p>
      <a href=${process.env.Origin}/resetPassword/${ResetLink} style="text-decoration: none"><button style="background-color:#0D47A1
      ; color:white; margin:auto">Reset Password</button></a>
      </div>`, // html body
  });
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  return {
    MessageSent: info.messageId,
    PreviewURL: nodemailer.getTestMessageUrl(info),
  };
};
const send = (req, res) => {
  sendEmail(req.body.Email, res.locals.Name)
    .then((response) => {
      console.log("Mail Response", response);
      res.status(200).json({
        status:
          "If your Email exists in our records you will recieve a mail in your inbox containig the password reset link. Remember to check your spam folder",
      });
    })
    .catch((error) => {
      res.status(200).json({
        status:
          "Error",
      });
    });
};
router.post("/", ifUserExists, send);
module.exports = router;
