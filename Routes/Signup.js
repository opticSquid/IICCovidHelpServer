const router = require("express").Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const sendMail = async (Email,Name,Password) => {
    let mailRoute = jwt.sign({Email: Email,Name: Name, Password: Password},process.env.EMAILTOKEN,{expiresIn:900});
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.gmail.com",
      auth: {
        user: process.env.EmailSender,
        pass: process.env.AppPassword
      }
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"myBondhu Portal" <soumalyabhattacharya6@gmail.com>', // sender address
      to: Email, // list of receivers
      subject: "Verification Mail from myBondhu", // Subject line
      html: `<b>
      Hello ${Name},
      </b>
      <div>
      <p>
      This mail is sent to you from myBondhu Portal to verify your mail address. This verification Link will be active for 15 minutes. 
      </p>
      <a href=http://localhost:5000/confirmEmail/${mailRoute} style="text-decoration: none"><button style="background-color:purple">Click this button to verify your mail</button></a>
      </div>`, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
    return {
      MessageSent: info.messageId,
      PreviewURL: nodemailer.getTestMessageUrl(info),
    };
  };
  
const sendVerificationEmail = (req, res) => {
    sendMail(req.body.Email,req.body.Name, req.body.Password).then((response) => {
      console.log("Response: ",response);
      res.status(200).json({status: "Mail sent yet to be verified"});
    }).catch((error)=>{
      if(error)
      {
        console.error("Error came while sending Email",error);
        res.status(200).json({status: "Mail could not be sent to the provided mail address"});
      }
    });
  };
router.post(
  "/",
  sendVerificationEmail
);

module.exports = router;
